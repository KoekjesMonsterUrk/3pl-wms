import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

interface InventoryWithRelations {
  product?: { name?: string; sku?: string } | null;
  location?: { code?: string } | null;
  lot_number?: string | null;
  quantity_on_hand: number;
  quantity_available: number;
  quantity_reserved: number;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);

    const warehouseId = searchParams.get('warehouse_id');
    const locationId = searchParams.get('location_id');
    const productId = searchParams.get('product_id');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const lowStock = searchParams.get('low_stock') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('page_size') || '50');

    let query = supabase
      .from('inventory')
      .select(`
        *,
        product:products(*),
        location:locations(
          *,
          zone:zones(*)
        ),
        warehouse:warehouses(*)
      `, { count: 'exact' })
      .order('updated_at', { ascending: false });

    if (warehouseId) {
      query = query.eq('warehouse_id', warehouseId);
    }

    if (locationId) {
      query = query.eq('location_id', locationId);
    }

    if (productId) {
      query = query.eq('product_id', productId);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (lowStock) {
      query = query.gt('quantity_available', 0);
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

    // Client-side search filter
    let filteredData = data as InventoryWithRelations[] | null;
    if (search && filteredData) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.product?.name?.toLowerCase().includes(searchLower) ||
          item.product?.sku?.toLowerCase().includes(searchLower) ||
          item.location?.code?.toLowerCase().includes(searchLower) ||
          item.lot_number?.toLowerCase().includes(searchLower)
      );
    }

    // Calculate stats
    const stats = {
      totalItems: filteredData?.length || 0,
      totalUnits: filteredData?.reduce((sum, item) => sum + (item.quantity_on_hand || 0), 0) || 0,
      totalAvailable: filteredData?.reduce((sum, item) => sum + (item.quantity_available || 0), 0) || 0,
      totalReserved: filteredData?.reduce((sum, item) => sum + (item.quantity_reserved || 0), 0) || 0,
    };

    return NextResponse.json({
      success: true,
      data: filteredData,
      stats,
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
      location_id,
      product_id,
      quantity,
      lot_number,
      serial_number,
      expiry_date,
      unit_cost,
      status = 'available',
    } = body;

    // Validate required fields
    if (!tenant_id || !warehouse_id || !location_id || !product_id || quantity === undefined) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' } },
        { status: 400 }
      );
    }

    // Check if inventory already exists for this product/location/lot
    const { data: existing } = await supabase
      .from('inventory')
      .select('id, quantity_on_hand, quantity_available')
      .eq('warehouse_id', warehouse_id)
      .eq('location_id', location_id)
      .eq('product_id', product_id)
      .eq('lot_number', lot_number || '')
      .single();

    if (existing) {
      // Update existing inventory
      const { data, error } = await supabase
        .from('inventory')
        .update({
          quantity_on_hand: existing.quantity_on_hand + quantity,
          quantity_available: existing.quantity_available + quantity,
        })
        .eq('id', existing.id)
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
    }

    // Create new inventory record
    const { data, error } = await supabase
      .from('inventory')
      .insert({
        tenant_id,
        warehouse_id,
        location_id,
        product_id,
        quantity_on_hand: quantity,
        quantity_reserved: 0,
        quantity_available: quantity,
        lot_number,
        serial_number,
        expiry_date,
        unit_cost,
        status,
        received_at: new Date().toISOString(),
        received_date: new Date().toISOString().split('T')[0],
      })
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

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
