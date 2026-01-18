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
      .from('inventory')
      .select(`
        *,
        product:products(*),
        location:locations(
          *,
          zone:zones(*)
        ),
        warehouse:warehouses(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: { code: 'NOT_FOUND', message: 'Inventory item not found' } },
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

    const { quantity_adjustment, adjustment_type, reason, status } = body;

    // Get current inventory
    const { data: current, error: fetchError } = await supabase
      .from('inventory')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !current) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Inventory item not found' } },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    // Handle quantity adjustment
    if (quantity_adjustment !== undefined && adjustment_type) {
      let newQuantity: number;
      if (adjustment_type === 'add') {
        newQuantity = current.quantity_on_hand + quantity_adjustment;
      } else if (adjustment_type === 'remove') {
        newQuantity = Math.max(0, current.quantity_on_hand - quantity_adjustment);
      } else {
        newQuantity = quantity_adjustment;
      }

      updateData.quantity_on_hand = newQuantity;
      updateData.quantity_available = Math.max(0, newQuantity - current.quantity_reserved);

      // Log the movement
      await supabase.from('inventory_movements').insert({
        tenant_id: current.tenant_id,
        inventory_id: id,
        product_id: current.product_id,
        movement_type: 'adjustment',
        quantity: adjustment_type === 'remove' ? -quantity_adjustment : quantity_adjustment,
        reason,
        performed_by: body.performed_by || current.tenant_id,
      });
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    const { data, error } = await supabase
      .from('inventory')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        product:products(*),
        location:locations(*)
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

    // Check if inventory has reserved quantity
    const { data: inventory } = await supabase
      .from('inventory')
      .select('quantity_reserved')
      .eq('id', id)
      .single();

    if (!inventory) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Inventory item not found' } },
        { status: 404 }
      );
    }

    if (inventory.quantity_reserved > 0) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_STATE', message: 'Cannot delete inventory with reserved quantity' } },
        { status: 400 }
      );
    }

    const { error } = await supabase.from('inventory').delete().eq('id', id);

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
