import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('outbound_orders')
      .select(`
        *,
        customer:customers(*),
        warehouse:warehouses(*),
        lines:outbound_order_lines(
          *,
          product:products(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: { code: 'NOT_FOUND', message: 'Outbound order not found' } },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { success: false, error: { code: 'DB_ERROR', message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseClient();
    const body = await request.json();

    const { status, priority, required_date, tracking_number, shipping_method, notes } = body;

    const updateData: Record<string, unknown> = {};

    if (status !== undefined) {
      updateData.status = status;
      if (status === 'shipped') {
        updateData.shipped_date = new Date().toISOString();
      }
    }

    if (priority !== undefined) updateData.priority = priority;
    if (required_date !== undefined) updateData.required_date = required_date;
    if (tracking_number !== undefined) updateData.tracking_number = tracking_number;
    if (shipping_method !== undefined) updateData.shipping_method = shipping_method;
    if (notes !== undefined) updateData.notes = notes;

    const { data, error } = await supabase
      .from('outbound_orders')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        customer:customers(*),
        warehouse:warehouses(*),
        lines:outbound_order_lines(
          *,
          product:products(*)
        )
      `)
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: { code: 'DB_ERROR', message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseClient();

    // Check if order can be deleted
    const { data: order } = await supabase
      .from('outbound_orders')
      .select('status')
      .eq('id', id)
      .single();

    if (!order) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Outbound order not found' } },
        { status: 404 }
      );
    }

    if (!['draft', 'pending', 'cancelled'].includes(order.status)) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_STATE', message: 'Cannot delete order in current status' } },
        { status: 400 }
      );
    }

    // Delete order lines first
    await supabase.from('outbound_order_lines').delete().eq('outbound_order_id', id);

    // Delete order
    const { error } = await supabase.from('outbound_orders').delete().eq('id', id);

    if (error) {
      return NextResponse.json(
        { success: false, error: { code: 'DB_ERROR', message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: null });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
