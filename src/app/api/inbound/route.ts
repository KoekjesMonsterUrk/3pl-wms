import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);

    const status = searchParams.get('status');
    const customerId = searchParams.get('customer_id');
    const warehouseId = searchParams.get('warehouse_id');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('page_size') || '20');

    let query = supabase
      .from('inbound_orders')
      .select(`
        *,
        customer:customers(*),
        warehouse:warehouses(*),
        lines:inbound_order_lines(
          *,
          product:products(*)
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    if (warehouseId) {
      query = query.eq('warehouse_id', warehouseId);
    }

    if (search) {
      query = query.or(`order_number.ilike.%${search}%,reference_number.ilike.%${search}%`);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: { code: 'DB_ERROR', message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      meta: {
        page,
        pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();

    const {
      tenant_id,
      warehouse_id,
      customer_id,
      reference_number,
      supplier_reference,
      expected_date,
      priority = 'normal',
      notes,
      lines,
      created_by,
    } = body;

    // Validate required fields
    if (!tenant_id || !warehouse_id || !customer_id || !created_by) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' } },
        { status: 400 }
      );
    }

    // Generate order number
    const { data: lastOrder } = await supabase
      .from('inbound_orders')
      .select('order_number')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const lastNum = lastOrder?.order_number
      ? parseInt(lastOrder.order_number.split('-').pop() || '0')
      : 0;
    const orderNumber = `INB-${new Date().getFullYear()}-${String(lastNum + 1).padStart(4, '0')}`;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('inbound_orders')
      .insert({
        tenant_id,
        warehouse_id,
        customer_id,
        order_number: orderNumber,
        reference_number,
        supplier_reference,
        expected_date,
        priority,
        notes,
        status: 'pending',
        created_by,
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json(
        { success: false, error: { code: 'DB_ERROR', message: orderError.message } },
        { status: 500 }
      );
    }

    // Create order lines
    if (lines && lines.length > 0) {
      const orderLines = lines.map((line: { product_id: string; expected_quantity: number; lot_number?: string; expiry_date?: string; notes?: string }, index: number) => ({
        inbound_order_id: order.id,
        product_id: line.product_id,
        line_number: index + 1,
        expected_quantity: line.expected_quantity,
        received_quantity: 0,
        lot_number: line.lot_number,
        expiry_date: line.expiry_date,
        notes: line.notes,
      }));

      const { error: linesError } = await supabase
        .from('inbound_order_lines')
        .insert(orderLines);

      if (linesError) {
        // Rollback order creation
        await supabase.from('inbound_orders').delete().eq('id', order.id);
        return NextResponse.json(
          { success: false, error: { code: 'DB_ERROR', message: linesError.message } },
          { status: 500 }
        );
      }
    }

    // Fetch complete order with relations
    const { data: completeOrder } = await supabase
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
      .eq('id', order.id)
      .single();

    return NextResponse.json({ success: true, data: completeOrder }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
