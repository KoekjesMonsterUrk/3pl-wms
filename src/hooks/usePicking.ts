'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import type { PickTask } from '@/types';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ============================================================================
// Pick Tasks
// ============================================================================

interface UsePickTasksOptions {
  status?: string;
  warehouseId?: string;
  assignedTo?: string;
  orderId?: string;
  search?: string;
  enabled?: boolean;
}

export function usePickTasks(options: UsePickTasksOptions = {}) {
  const { status, warehouseId, assignedTo, orderId, search, enabled = true } = options;

  return useQuery({
    queryKey: ['pick-tasks', { status, warehouseId, assignedTo, orderId, search }],
    queryFn: async () => {
      const supabase = getSupabaseClient();

      let query = supabase
        .from('pick_tasks')
        .select(`
          *,
          product:products(*),
          from_location:locations!pick_tasks_from_location_id_fkey(*),
          to_location:locations!pick_tasks_to_location_id_fkey(*),
          order:outbound_orders(*),
          assigned_user:users!pick_tasks_assigned_to_fkey(*)
        `)
        .order('priority', { ascending: false })
        .order('pick_sequence', { ascending: true });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      if (warehouseId) {
        query = query.eq('warehouse_id', warehouseId);
      }

      if (assignedTo) {
        query = query.eq('assigned_to', assignedTo);
      }

      if (orderId) {
        query = query.eq('order_id', orderId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Client-side search filter
      let filtered = data as PickTask[];
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(
          (task) =>
            task.product?.name?.toLowerCase().includes(searchLower) ||
            task.product?.sku?.toLowerCase().includes(searchLower) ||
            task.from_location?.code?.toLowerCase().includes(searchLower) ||
            task.order?.order_number?.toLowerCase().includes(searchLower)
        );
      }

      return filtered;
    },
    enabled,
  });
}

export function usePickTask(id: string) {
  return useQuery({
    queryKey: ['pick-task', id],
    queryFn: async () => {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from('pick_tasks')
        .select(`
          *,
          product:products(*),
          from_location:locations!pick_tasks_from_location_id_fkey(*),
          to_location:locations!pick_tasks_to_location_id_fkey(*),
          order:outbound_orders(
            *,
            customer:customers(*)
          ),
          assigned_user:users!pick_tasks_assigned_to_fkey(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as PickTask;
    },
    enabled: !!id,
  });
}

// ============================================================================
// Pick Task Mutations
// ============================================================================

export function useAssignPickTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, userId }: { taskId: string; userId: string }) => {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from('pick_tasks')
        .update({
          assigned_to: userId,
          assigned_at: new Date().toISOString(),
          status: 'assigned',
        })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['pick-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['pick-task', taskId] });
    },
  });
}

export function useStartPickTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from('pick_tasks')
        .update({
          status: 'in_progress',
          started_at: new Date().toISOString(),
        })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({ queryKey: ['pick-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['pick-task', taskId] });
    },
  });
}

export function useCompletePickTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      pickedQuantity,
      notes,
    }: {
      taskId: string;
      pickedQuantity: number;
      notes?: string;
    }) => {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from('pick_tasks')
        .update({
          status: 'completed',
          picked_quantity: pickedQuantity,
          completed_at: new Date().toISOString(),
          notes,
        })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['pick-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['pick-task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['outbound-orders'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export function useCancelPickTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, reason }: { taskId: string; reason?: string }) => {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from('pick_tasks')
        .update({
          status: 'cancelled',
          notes: reason,
        })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['pick-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['pick-task', taskId] });
    },
  });
}

// ============================================================================
// Pick Task Stats
// ============================================================================

export function usePickTaskStats(warehouseId?: string) {
  return useQuery({
    queryKey: ['pick-task-stats', warehouseId],
    queryFn: async () => {
      const supabase = getSupabaseClient();

      let query = supabase.from('pick_tasks').select('status, priority');

      if (warehouseId) {
        query = query.eq('warehouse_id', warehouseId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const tasks = data || [];

      return {
        total: tasks.length,
        pending: tasks.filter((t) => t.status === 'pending').length,
        assigned: tasks.filter((t) => t.status === 'assigned').length,
        inProgress: tasks.filter((t) => t.status === 'in_progress').length,
        completed: tasks.filter((t) => t.status === 'completed').length,
        cancelled: tasks.filter((t) => t.status === 'cancelled').length,
        urgent: tasks.filter((t) => t.priority === 'urgent').length,
        high: tasks.filter((t) => t.priority === 'high').length,
      };
    },
  });
}

// ============================================================================
// My Tasks (for operators)
// ============================================================================

export function useMyPickTasks(userId: string) {
  return useQuery({
    queryKey: ['my-pick-tasks', userId],
    queryFn: async () => {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from('pick_tasks')
        .select(`
          *,
          product:products(*),
          from_location:locations!pick_tasks_from_location_id_fkey(*),
          order:outbound_orders(*)
        `)
        .eq('assigned_to', userId)
        .in('status', ['assigned', 'in_progress'])
        .order('priority', { ascending: false })
        .order('pick_sequence', { ascending: true });

      if (error) throw error;
      return data as PickTask[];
    },
    enabled: !!userId,
  });
}
