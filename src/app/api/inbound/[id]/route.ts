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
      .from('inbound_orders')
      .select(`
        *,
        customer:customers(*),
        warehouse:warehouses(*),
        lines:inbound_order_lines(
          *,
          product:products(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: { code: 'NOT_FOUND', message: 'Inbound order not found' } },
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

    const { status, priority, expected_date, notes } = body;

    const updateData: Record<string, unknown> = {};

    if (status !== undefined) {
      updateData.status = status;
      if (status === 'received') {
        updateData.received_date = new Date().toISOString();
      }
    }

    if (priority !== undefined) updateData.priority = priority;
    if (expected_date !== undefined) updateData.expected_date = expected_date;
    if (notes !== undefined) updateData.notes = notes;

    const { data, error } = await supabase
      .from('inbound_orders')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        customer:customers(*),
        warehouse:warehouses(*),
        lines:inbound_order_lines(
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

    // Check if order can be deleted (only draft or pending)
    const { data: order } = await supabase
      .from('inbound_orders')
      .select('status')
      .eq('id', id)
      .single();

    if (!order) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Inbound order not found' } },
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
    await supabase.from('inbound_order_lines').delete().eq('inbound_order_id', id);

    // Delete order
    const { error } = await supabase.from('inbound_orders').delete().eq('id', id);

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
