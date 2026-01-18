'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import type { InventoryItem, Location, Product } from '@/types';
import type { Database } from '@/types/database';

type InventoryRow = Database['public']['Tables']['inventory']['Row'];

// Create an untyped client for mutations to avoid complex type inference issues
function getUntypedClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Keep the typed client for queries
function getSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ============================================================================
// Inventory
// ============================================================================

interface UseInventoryOptions {
  warehouseId?: string;
  locationId?: string;
  productId?: string;
  status?: string;
  search?: string;
  enabled?: boolean;
}

export function useInventory(options: UseInventoryOptions = {}) {
  const { warehouseId, locationId, productId, status, search, enabled = true } = options;

  return useQuery({
    queryKey: ['inventory', { warehouseId, locationId, productId, status, search }],
    queryFn: async () => {
      const supabase = getSupabaseClient();

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
        `)
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

      const { data, error } = await query;

      if (error) throw error;

      // Filter by search if provided (client-side for now)
      let filtered = data as InventoryItem[];
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.product?.name?.toLowerCase().includes(searchLower) ||
            item.product?.sku?.toLowerCase().includes(searchLower) ||
            item.location?.code?.toLowerCase().includes(searchLower) ||
            item.lot_number?.toLowerCase().includes(searchLower)
        );
      }

      return {
        items: filtered,
        total: filtered.length,
        totalUnits: filtered.reduce((sum, item) => sum + item.quantity_on_hand, 0),
        totalAvailable: filtered.reduce((sum, item) => sum + item.quantity_available, 0),
      };
    },
    enabled,
  });
}

export function useInventoryByProduct(productId: string) {
  return useQuery({
    queryKey: ['inventory-by-product', productId],
    queryFn: async () => {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          location:locations(*),
          warehouse:warehouses(*)
        `)
        .eq('product_id', productId)
        .eq('status', 'available')
        .gt('quantity_available', 0)
        .order('received_at', { ascending: true });

      if (error) throw error;
      return data as InventoryItem[];
    },
    enabled: !!productId,
  });
}

export function useInventoryByLocation(locationId: string) {
  return useQuery({
    queryKey: ['inventory-by-location', locationId],
    queryFn: async () => {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          product:products(*)
        `)
        .eq('location_id', locationId)
        .order('product_id');

      if (error) throw error;
      return data as InventoryItem[];
    },
    enabled: !!locationId,
  });
}

// ============================================================================
// Inventory Adjustments
// ============================================================================

interface AdjustInventoryParams {
  inventoryId: string;
  quantity: number;
  reason: string;
  type: 'add' | 'remove' | 'set';
}

export function useAdjustInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ inventoryId, quantity, reason, type }: AdjustInventoryParams) => {
      const supabase = getUntypedClient();

      // Get current inventory
      const { data: currentData, error: fetchError } = await supabase
        .from('inventory')
        .select('*')
        .eq('id', inventoryId)
        .single();

      if (fetchError) throw fetchError;

      const current = currentData as InventoryRow;

      let newQuantity: number;
      if (type === 'add') {
        newQuantity = current.quantity_on_hand + quantity;
      } else if (type === 'remove') {
        newQuantity = Math.max(0, current.quantity_on_hand - quantity);
      } else {
        newQuantity = quantity;
      }

      const newAvailable = newQuantity - current.quantity_reserved;

      // Update inventory
      const { data, error } = await supabase
        .from('inventory')
        .update({
          quantity_on_hand: newQuantity,
          quantity_available: Math.max(0, newAvailable),
        })
        .eq('id', inventoryId)
        .select()
        .single();

      if (error) throw error;

      // Log the movement
      await supabase.from('inventory_movements').insert({
        inventory_id: inventoryId,
        movement_type: 'adjustment',
        quantity: type === 'remove' ? -quantity : quantity,
        reason,
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

// ============================================================================
// Inventory Transfer
// ============================================================================

interface TransferInventoryParams {
  inventoryId: string;
  toLocationId: string;
  quantity: number;
}

export function useTransferInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ inventoryId, toLocationId, quantity }: TransferInventoryParams) => {
      const supabase = getUntypedClient();

      // Get current inventory
      const { data: currentData, error: fetchError } = await supabase
        .from('inventory')
        .select('*')
        .eq('id', inventoryId)
        .single();

      if (fetchError) throw fetchError;

      const current = currentData as InventoryRow;

      if (quantity > current.quantity_available) {
        throw new Error('Onvoldoende beschikbare voorraad');
      }

      // Reduce from source
      await supabase
        .from('inventory')
        .update({
          quantity_on_hand: current.quantity_on_hand - quantity,
          quantity_available: current.quantity_available - quantity,
        })
        .eq('id', inventoryId);

      // Check if destination already has this product
      const { data: existingData } = await supabase
        .from('inventory')
        .select('*')
        .eq('location_id', toLocationId)
        .eq('product_id', current.product_id)
        .eq('lot_number', current.lot_number || '')
        .single();

      const existing = existingData as InventoryRow | null;

      if (existing) {
        // Add to existing
        await supabase
          .from('inventory')
          .update({
            quantity_on_hand: existing.quantity_on_hand + quantity,
            quantity_available: existing.quantity_available + quantity,
          })
          .eq('id', existing.id);
      } else {
        // Create new inventory record
        await supabase.from('inventory').insert({
          tenant_id: current.tenant_id,
          warehouse_id: current.warehouse_id,
          location_id: toLocationId,
          product_id: current.product_id,
          lot_number: current.lot_number,
          expiry_date: current.expiry_date,
          quantity_on_hand: quantity,
          quantity_reserved: 0,
          quantity_available: quantity,
          status: 'available',
          received_at: current.received_at,
        });
      }

      // Log the movement
      await supabase.from('inventory_movements').insert({
        inventory_id: inventoryId,
        movement_type: 'transfer',
        quantity: -quantity,
        from_location_id: current.location_id,
        to_location_id: toLocationId,
      });

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

// ============================================================================
// Locations
// ============================================================================

export function useLocations(warehouseId?: string, zoneId?: string) {
  return useQuery({
    queryKey: ['locations', { warehouseId, zoneId }],
    queryFn: async () => {
      const supabase = getSupabaseClient();

      let query = supabase
        .from('locations')
        .select(`
          *,
          zone:zones(*)
        `)
        .eq('is_active', true)
        .order('code');

      if (warehouseId) {
        query = query.eq('warehouse_id', warehouseId);
      }

      if (zoneId) {
        query = query.eq('zone_id', zoneId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Location[];
    },
  });
}

export function useLocation(id: string) {
  return useQuery({
    queryKey: ['location', id],
    queryFn: async () => {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from('locations')
        .select(`
          *,
          zone:zones(*),
          warehouse:warehouses(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Location;
    },
    enabled: !!id,
  });
}

// ============================================================================
// Products
// ============================================================================

export function useProducts(options: { search?: string; customerId?: string } = {}) {
  const { search, customerId } = options;

  return useQuery({
    queryKey: ['products', { search, customerId }],
    queryFn: async () => {
      const supabase = getSupabaseClient();

      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (customerId) {
        query = query.or(`customer_id.eq.${customerId},customer_id.is.null`);
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%,barcode.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Product[];
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          customer:customers(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Product;
    },
    enabled: !!id,
  });
}

// ============================================================================
// Inventory Stats
// ============================================================================

export function useInventoryStats(warehouseId?: string) {
  return useQuery({
    queryKey: ['inventory-stats', warehouseId],
    queryFn: async () => {
      const supabase = getUntypedClient();

      // Get inventory summary
      let query = supabase.from('inventory').select('*');

      if (warehouseId) {
        query = query.eq('warehouse_id', warehouseId);
      }

      const { data: inventoryData, error } = await query;

      if (error) throw error;

      const inventory = inventoryData as InventoryRow[] | null;

      // Calculate stats
      const totalItems = inventory?.length || 0;
      const totalUnits = inventory?.reduce((sum, i) => sum + i.quantity_on_hand, 0) || 0;
      const totalReserved = inventory?.reduce((sum, i) => sum + i.quantity_reserved, 0) || 0;
      const totalAvailable = inventory?.reduce((sum, i) => sum + i.quantity_available, 0) || 0;

      // Get low stock items
      const { data: lowStock } = await supabase
        .from('inventory')
        .select(`
          *,
          product:products(min_stock_level)
        `)
        .gt('products.min_stock_level', 0);

      interface LowStockItem {
        quantity_available: number;
        product?: { min_stock_level: number | null };
      }

      const lowStockCount =
        (lowStock as LowStockItem[] | null)?.filter(
          (i) => i.product?.min_stock_level && i.quantity_available < i.product.min_stock_level
        ).length || 0;

      return {
        totalItems,
        totalUnits,
        totalReserved,
        totalAvailable,
        lowStockCount,
      };
    },
  });
}
