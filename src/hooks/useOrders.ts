'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import type { InboundOrder, OutboundOrder, InboundOrderFormData, OutboundOrderFormData, Wave } from '@/types';

// Create an untyped client for mutations to avoid complex type inference issues
function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ============================================================================
// Inbound Orders
// ============================================================================

interface UseInboundOrdersOptions {
  status?: string;
  customerId?: string;
  warehouseId?: string;
  search?: string;
  enabled?: boolean;
}

export function useInboundOrders(options: UseInboundOrdersOptions = {}) {
  const { status, customerId, warehouseId, search, enabled = true } = options;

  return useQuery({
    queryKey: ['inbound-orders', { status, customerId, warehouseId, search }],
    queryFn: async () => {
      const supabase = getSupabaseClient();

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
        `)
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

      const { data, error } = await query;

      if (error) throw error;
      return data as InboundOrder[];
    },
    enabled,
  });
}

export function useInboundOrder(id: string) {
  return useQuery({
    queryKey: ['inbound-order', id],
    queryFn: async () => {
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

      if (error) throw error;
      return data as InboundOrder;
    },
    enabled: !!id,
  });
}

export function useCreateInboundOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InboundOrderFormData) => {
      const supabase = getSupabaseClient();

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
          ...data,
          order_number: orderNumber,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order lines
      const lines = data.lines.map((line, index) => ({
        ...line,
        inbound_order_id: order.id,
        line_number: index + 1,
        received_quantity: 0,
      }));

      const { error: linesError } = await supabase
        .from('inbound_order_lines')
        .insert(lines);

      if (linesError) throw linesError;

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbound-orders'] });
    },
  });
}

export function useUpdateInboundOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const supabase = getSupabaseClient();

      const updateData: Record<string, unknown> = { status };

      if (status === 'received') {
        updateData.received_date = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('inbound_orders')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['inbound-orders'] });
      queryClient.invalidateQueries({ queryKey: ['inbound-order', id] });
    },
  });
}

// ============================================================================
// Outbound Orders
// ============================================================================

interface UseOutboundOrdersOptions {
  status?: string;
  customerId?: string;
  warehouseId?: string;
  waveId?: string;
  search?: string;
  enabled?: boolean;
}

export function useOutboundOrders(options: UseOutboundOrdersOptions = {}) {
  const { status, customerId, warehouseId, waveId, search, enabled = true } = options;

  return useQuery({
    queryKey: ['outbound-orders', { status, customerId, warehouseId, waveId, search }],
    queryFn: async () => {
      const supabase = getSupabaseClient();

      let query = supabase
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

      if (waveId) {
        query = query.eq('wave_id', waveId);
      }

      if (search) {
        query = query.or(
          `order_number.ilike.%${search}%,reference_number.ilike.%${search}%,tracking_number.ilike.%${search}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as OutboundOrder[];
    },
    enabled,
  });
}

export function useOutboundOrder(id: string) {
  return useQuery({
    queryKey: ['outbound-order', id],
    queryFn: async () => {
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

      if (error) throw error;
      return data as OutboundOrder;
    },
    enabled: !!id,
  });
}

export function useCreateOutboundOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: OutboundOrderFormData) => {
      const supabase = getSupabaseClient();

      // Generate order number
      const { data: lastOrder } = await supabase
        .from('outbound_orders')
        .select('order_number')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const lastNum = lastOrder?.order_number
        ? parseInt(lastOrder.order_number.split('-').pop() || '0')
        : 0;
      const orderNumber = `OUT-${new Date().getFullYear()}-${String(lastNum + 1).padStart(4, '0')}`;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('outbound_orders')
        .insert({
          ...data,
          order_number: orderNumber,
          status: 'pending',
          order_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order lines
      const lines = data.lines.map((line, index) => ({
        ...line,
        outbound_order_id: order.id,
        line_number: index + 1,
        allocated_quantity: 0,
        picked_quantity: 0,
        shipped_quantity: 0,
      }));

      const { error: linesError } = await supabase
        .from('outbound_order_lines')
        .insert(lines);

      if (linesError) throw linesError;

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outbound-orders'] });
    },
  });
}

export function useUpdateOutboundOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      trackingNumber,
    }: {
      id: string;
      status: string;
      trackingNumber?: string;
    }) => {
      const supabase = getSupabaseClient();

      const updateData: Record<string, unknown> = { status };

      if (status === 'shipped') {
        updateData.ship_date = new Date().toISOString();
        if (trackingNumber) {
          updateData.tracking_number = trackingNumber;
        }
      }

      const { data, error } = await supabase
        .from('outbound_orders')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['outbound-orders'] });
      queryClient.invalidateQueries({ queryKey: ['outbound-order', id] });
    },
  });
}

// ============================================================================
// Waves
// ============================================================================

export function useWaves(warehouseId?: string) {
  return useQuery({
    queryKey: ['waves', warehouseId],
    queryFn: async () => {
      const supabase = getSupabaseClient();

      let query = supabase
        .from('waves')
        .select('*')
        .order('created_at', { ascending: false });

      if (warehouseId) {
        query = query.eq('warehouse_id', warehouseId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Wave[];
    },
  });
}

export function useCreateWave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      warehouseId,
      orderIds,
    }: {
      warehouseId: string;
      orderIds: string[];
    }) => {
      const supabase = getSupabaseClient();

      // Generate wave number
      const { data: lastWave } = await supabase
        .from('waves')
        .select('wave_number')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const lastNum = lastWave?.wave_number
        ? parseInt(lastWave.wave_number.split('-').pop() || '0')
        : 0;
      const waveNumber = `W-${new Date().getFullYear()}-${String(lastNum + 1).padStart(3, '0')}`;

      // Create wave
      const { data: wave, error: waveError } = await supabase
        .from('waves')
        .insert({
          warehouse_id: warehouseId,
          wave_number: waveNumber,
          status: 'draft',
          order_count: orderIds.length,
          line_count: 0, // Will be calculated
        })
        .select()
        .single();

      if (waveError) throw waveError;

      // Update orders with wave_id
      const { error: updateError } = await supabase
        .from('outbound_orders')
        .update({ wave_id: wave.id })
        .in('id', orderIds);

      if (updateError) throw updateError;

      return wave;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waves'] });
      queryClient.invalidateQueries({ queryKey: ['outbound-orders'] });
    },
  });
}
