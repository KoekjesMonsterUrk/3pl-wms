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

    const customerId = searchParams.get('customer_id');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const activeOnly = searchParams.get('active') !== 'false';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('page_size') || '50');

    let query = supabase
      .from('products')
      .select(`
        *,
        customer:customers(*)
      `, { count: 'exact' })
      .order('name');

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    if (customerId) {
      query = query.or(`customer_id.eq.${customerId},customer_id.is.null`);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%,barcode.ilike.%${search}%`);
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
      customer_id,
      sku,
      name,
      description,
      barcode,
      upc,
      category,
      unit_of_measure = 'each',
      weight,
      weight_unit,
      length,
      width,
      height,
      storage_requirements,
      min_stock_level,
      max_stock_level,
      reorder_point,
      requires_lot_tracking = false,
      requires_serial_tracking = false,
      requires_expiry_tracking = false,
      shelf_life_days,
      image_url,
      metadata,
    } = body;

    // Validate required fields
    if (!tenant_id || !sku || !name) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Missing required fields (tenant_id, sku, name)' } },
        { status: 400 }
      );
    }

    // Check for duplicate SKU
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('tenant_id', tenant_id)
      .eq('sku', sku)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: { code: 'DUPLICATE', message: 'A product with this SKU already exists' } },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        tenant_id,
        customer_id,
        sku,
        name,
        description,
        barcode,
        upc,
        category,
        unit_of_measure,
        weight,
        weight_unit,
        length,
        width,
        height,
        storage_requirements,
        min_stock_level,
        max_stock_level,
        reorder_point,
        requires_lot_tracking,
        requires_serial_tracking,
        requires_expiry_tracking,
        shelf_life_days,
        image_url,
        metadata: metadata || {},
        is_active: true,
      })
      .select(`
        *,
        customer:customers(*)
      `)
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: { code: 'DB_ERROR', message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
