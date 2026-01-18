/**
 * TypeScript types generated from Supabase database schema.
 * Enterprise 3PL Warehouse Management System
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ============================================================================
// Enums
// ============================================================================

export type OrderStatus =
  | 'draft'
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'on_hold';

export type InboundOrderStatus =
  | 'draft'
  | 'pending'
  | 'confirmed'
  | 'scheduled'
  | 'receiving'
  | 'quality_check'
  | 'received'
  | 'putaway_pending'
  | 'putaway'
  | 'completed'
  | 'cancelled';

export type OutboundOrderStatus =
  | 'draft'
  | 'pending'
  | 'confirmed'
  | 'allocated'
  | 'picking'
  | 'picked'
  | 'packing'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type TaskStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
export type TaskType = 'receive' | 'putaway' | 'pick' | 'pack' | 'ship' | 'move' | 'count';
export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';

export type LocationType = 'receiving' | 'storage' | 'picking' | 'packing' | 'shipping' | 'staging' | 'bulk' | 'quarantine';
export type StorageType = 'standard' | 'cold' | 'frozen' | 'hazmat' | 'bonded' | 'high_value';

export type InventoryStatus = 'available' | 'reserved' | 'damaged' | 'quarantine' | 'expired' | 'allocated';

export type InvoiceStatus = 'draft' | 'pending' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export type UserRole = 'admin' | 'manager' | 'supervisor' | 'operator' | 'viewer' | 'customer';

export type MovementType = 'receive' | 'putaway' | 'pick' | 'transfer' | 'adjustment' | 'count' | 'ship';

export type AutomationTrigger =
  | 'inventory_low'
  | 'order_created'
  | 'order_status_changed'
  | 'stock_expiring'
  | 'task_overdue'
  | 'schedule';

export type AutomationAction =
  | 'send_notification'
  | 'create_task'
  | 'update_priority'
  | 'send_email'
  | 'webhook'
  | 'create_report';

// ============================================================================
// Database Interface
// ============================================================================

// Helper types for easier access
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          name: string;
          slug: string;
          code: string;
          settings: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          code?: string;
          settings?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          code?: string;
          settings?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          auth_id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          role: UserRole;
          tenant_id: string;
          warehouse_ids: string[];
          settings: Json;
          is_active: boolean;
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          role?: UserRole;
          tenant_id: string;
          warehouse_ids?: string[];
          settings?: Json;
          is_active?: boolean;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          role?: UserRole;
          tenant_id?: string;
          warehouse_ids?: string[];
          settings?: Json;
          is_active?: boolean;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      warehouses: {
        Row: {
          id: string;
          tenant_id: string;
          code: string;
          name: string;
          address: Json;
          contact: Json;
          settings: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          code: string;
          name: string;
          address: Json;
          contact?: Json;
          settings?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          code?: string;
          name?: string;
          address?: Json;
          contact?: Json;
          settings?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      zones: {
        Row: {
          id: string;
          warehouse_id: string;
          code: string;
          name: string;
          zone_type: string;
          settings: Json | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          warehouse_id: string;
          code: string;
          name: string;
          zone_type: string;
          settings?: Json | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          warehouse_id?: string;
          code?: string;
          name?: string;
          zone_type?: string;
          settings?: Json | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      locations: {
        Row: {
          id: string;
          warehouse_id: string;
          zone_id: string;
          code: string;
          name: string;
          aisle: string;
          rack: string;
          level: string;
          position: string;
          location_type: string;
          storage_type: string;
          max_weight: number | null;
          max_volume: number | null;
          max_capacity: number | null;
          current_weight: number | null;
          current_volume: number | null;
          current_utilization: number;
          is_active: boolean;
          is_pickable: boolean;
          is_storable: boolean;
          is_available: boolean;
          pick_sequence: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          warehouse_id: string;
          zone_id: string;
          code: string;
          name?: string;
          aisle: string;
          rack: string;
          level: string;
          position: string;
          location_type: string;
          storage_type?: string;
          max_weight?: number | null;
          max_volume?: number | null;
          max_capacity?: number | null;
          current_weight?: number | null;
          current_volume?: number | null;
          current_utilization?: number;
          is_active?: boolean;
          is_pickable?: boolean;
          is_storable?: boolean;
          is_available?: boolean;
          pick_sequence?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          warehouse_id?: string;
          zone_id?: string;
          code?: string;
          name?: string;
          aisle?: string;
          rack?: string;
          level?: string;
          position?: string;
          location_type?: string;
          storage_type?: string;
          max_weight?: number | null;
          max_volume?: number | null;
          max_capacity?: number | null;
          current_weight?: number | null;
          current_volume?: number | null;
          current_utilization?: number;
          is_active?: boolean;
          is_pickable?: boolean;
          is_storable?: boolean;
          is_available?: boolean;
          pick_sequence?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          tenant_id: string;
          code: string;
          name: string;
          type: string;
          billing_address: Json;
          shipping_address: Json | null;
          contact: Json;
          settings: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          code: string;
          name: string;
          type?: string;
          billing_address: Json;
          shipping_address?: Json | null;
          contact?: Json;
          settings?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          code?: string;
          name?: string;
          type?: string;
          billing_address?: Json;
          shipping_address?: Json | null;
          contact?: Json;
          settings?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          tenant_id: string;
          customer_id: string | null;
          sku: string;
          barcode: string | null;
          upc: string | null;
          name: string;
          description: string | null;
          category: string | null;
          unit_of_measure: string;
          weight: number | null;
          weight_unit: string | null;
          length: number | null;
          width: number | null;
          height: number | null;
          storage_requirements: string | null;
          min_stock_level: number | null;
          max_stock_level: number | null;
          reorder_point: number | null;
          requires_lot_tracking: boolean;
          requires_serial_tracking: boolean;
          requires_expiry_tracking: boolean;
          shelf_life_days: number | null;
          image_url: string | null;
          metadata: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          customer_id?: string | null;
          sku: string;
          barcode?: string | null;
          upc?: string | null;
          name: string;
          description?: string | null;
          category?: string | null;
          unit_of_measure?: string;
          weight?: number | null;
          weight_unit?: string | null;
          length?: number | null;
          width?: number | null;
          height?: number | null;
          storage_requirements?: string | null;
          min_stock_level?: number | null;
          max_stock_level?: number | null;
          reorder_point?: number | null;
          requires_lot_tracking?: boolean;
          requires_serial_tracking?: boolean;
          requires_expiry_tracking?: boolean;
          shelf_life_days?: number | null;
          image_url?: string | null;
          metadata?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          customer_id?: string | null;
          sku?: string;
          barcode?: string | null;
          upc?: string | null;
          name?: string;
          description?: string | null;
          category?: string | null;
          unit_of_measure?: string;
          weight?: number | null;
          weight_unit?: string | null;
          length?: number | null;
          width?: number | null;
          height?: number | null;
          storage_requirements?: string | null;
          min_stock_level?: number | null;
          max_stock_level?: number | null;
          reorder_point?: number | null;
          requires_lot_tracking?: boolean;
          requires_serial_tracking?: boolean;
          requires_expiry_tracking?: boolean;
          shelf_life_days?: number | null;
          image_url?: string | null;
          metadata?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      inventory: {
        Row: {
          id: string;
          tenant_id: string;
          warehouse_id: string;
          location_id: string;
          product_id: string;
          lot_number: string | null;
          serial_number: string | null;
          expiry_date: string | null;
          quantity: number;
          quantity_on_hand: number;
          quantity_reserved: number;
          quantity_available: number;
          status: string;
          received_at: string;
          received_date: string;
          unit_cost: number | null;
          cost_price: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          warehouse_id: string;
          location_id: string;
          product_id: string;
          lot_number?: string | null;
          serial_number?: string | null;
          expiry_date?: string | null;
          quantity?: number;
          quantity_on_hand?: number;
          quantity_reserved?: number;
          quantity_available?: number;
          status?: string;
          received_at?: string;
          received_date?: string;
          unit_cost?: number | null;
          cost_price?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          warehouse_id?: string;
          location_id?: string;
          product_id?: string;
          lot_number?: string | null;
          serial_number?: string | null;
          expiry_date?: string | null;
          quantity?: number;
          quantity_on_hand?: number;
          quantity_reserved?: number;
          quantity_available?: number;
          status?: string;
          received_at?: string;
          received_date?: string;
          unit_cost?: number | null;
          cost_price?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      inbound_orders: {
        Row: {
          id: string;
          tenant_id: string;
          warehouse_id: string;
          customer_id: string;
          order_number: string;
          external_reference: string | null;
          reference_number: string | null;
          supplier_id: string | null;
          supplier_name: string | null;
          supplier_reference: string | null;
          status: string;
          priority: string;
          expected_date: string | null;
          received_date: string | null;
          notes: string | null;
          metadata: Json;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          warehouse_id: string;
          customer_id: string;
          order_number: string;
          external_reference?: string | null;
          reference_number?: string | null;
          supplier_id?: string | null;
          supplier_name?: string | null;
          supplier_reference?: string | null;
          status?: string;
          priority?: string;
          expected_date?: string | null;
          received_date?: string | null;
          notes?: string | null;
          metadata?: Json;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          warehouse_id?: string;
          customer_id?: string;
          order_number?: string;
          external_reference?: string | null;
          reference_number?: string | null;
          supplier_id?: string | null;
          supplier_name?: string | null;
          supplier_reference?: string | null;
          status?: string;
          priority?: string;
          expected_date?: string | null;
          received_date?: string | null;
          notes?: string | null;
          metadata?: Json;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      inbound_order_lines: {
        Row: {
          id: string;
          inbound_order_id: string;
          order_id: string;
          product_id: string;
          line_number: number;
          expected_quantity: number;
          received_quantity: number;
          lot_number: string | null;
          expiry_date: string | null;
          unit_cost: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          inbound_order_id: string;
          order_id?: string;
          product_id: string;
          line_number: number;
          expected_quantity: number;
          received_quantity?: number;
          lot_number?: string | null;
          expiry_date?: string | null;
          unit_cost?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          inbound_order_id?: string;
          order_id?: string;
          product_id?: string;
          line_number?: number;
          expected_quantity?: number;
          received_quantity?: number;
          lot_number?: string | null;
          expiry_date?: string | null;
          unit_cost?: number | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      outbound_orders: {
        Row: {
          id: string;
          tenant_id: string;
          warehouse_id: string;
          customer_id: string;
          order_number: string;
          external_reference: string | null;
          reference_number: string | null;
          customer_reference: string | null;
          status: string;
          priority: string;
          order_date: string;
          required_date: string | null;
          ship_date: string | null;
          shipped_date: string | null;
          ship_to_address: Json;
          shipping_method: string | null;
          tracking_number: string | null;
          notes: string | null;
          wave_id: string | null;
          metadata: Json;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          warehouse_id: string;
          customer_id: string;
          order_number: string;
          external_reference?: string | null;
          reference_number?: string | null;
          customer_reference?: string | null;
          status?: string;
          priority?: string;
          order_date?: string;
          required_date?: string | null;
          ship_date?: string | null;
          shipped_date?: string | null;
          ship_to_address: Json;
          shipping_method?: string | null;
          tracking_number?: string | null;
          notes?: string | null;
          wave_id?: string | null;
          metadata?: Json;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          warehouse_id?: string;
          customer_id?: string;
          order_number?: string;
          external_reference?: string | null;
          reference_number?: string | null;
          customer_reference?: string | null;
          status?: string;
          priority?: string;
          order_date?: string;
          required_date?: string | null;
          ship_date?: string | null;
          shipped_date?: string | null;
          ship_to_address?: Json;
          shipping_method?: string | null;
          tracking_number?: string | null;
          notes?: string | null;
          wave_id?: string | null;
          metadata?: Json;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      outbound_order_lines: {
        Row: {
          id: string;
          outbound_order_id: string;
          order_id: string;
          product_id: string;
          line_number: number;
          ordered_quantity: number;
          requested_quantity: number;
          allocated_quantity: number;
          picked_quantity: number;
          shipped_quantity: number;
          lot_number: string | null;
          serial_number: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          outbound_order_id: string;
          order_id?: string;
          product_id: string;
          line_number: number;
          ordered_quantity: number;
          requested_quantity?: number;
          allocated_quantity?: number;
          picked_quantity?: number;
          shipped_quantity?: number;
          lot_number?: string | null;
          serial_number?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          outbound_order_id?: string;
          order_id?: string;
          product_id?: string;
          line_number?: number;
          ordered_quantity?: number;
          requested_quantity?: number;
          allocated_quantity?: number;
          picked_quantity?: number;
          shipped_quantity?: number;
          lot_number?: string | null;
          serial_number?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      waves: {
        Row: {
          id: string;
          warehouse_id: string;
          wave_number: string;
          status: string;
          order_count: number;
          line_count: number;
          start_time: string | null;
          end_time: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          warehouse_id: string;
          wave_number: string;
          status?: string;
          order_count?: number;
          line_count?: number;
          start_time?: string | null;
          end_time?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          warehouse_id?: string;
          wave_number?: string;
          status?: string;
          order_count?: number;
          line_count?: number;
          start_time?: string | null;
          end_time?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      pick_tasks: {
        Row: {
          id: string;
          tenant_id: string;
          warehouse_id: string;
          order_id: string;
          order_line_id: string;
          inventory_id: string;
          from_location_id: string;
          to_location_id: string | null;
          product_id: string;
          quantity: number;
          picked_quantity: number;
          status: string;
          priority: string;
          assigned_to: string | null;
          assigned_at: string | null;
          started_at: string | null;
          completed_at: string | null;
          pick_sequence: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          warehouse_id: string;
          order_id: string;
          order_line_id: string;
          inventory_id: string;
          from_location_id: string;
          to_location_id?: string | null;
          product_id: string;
          quantity: number;
          picked_quantity?: number;
          status?: string;
          priority?: string;
          assigned_to?: string | null;
          assigned_at?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          pick_sequence?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          warehouse_id?: string;
          order_id?: string;
          order_line_id?: string;
          inventory_id?: string;
          from_location_id?: string;
          to_location_id?: string | null;
          product_id?: string;
          quantity?: number;
          picked_quantity?: number;
          status?: string;
          priority?: string;
          assigned_to?: string | null;
          assigned_at?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          pick_sequence?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          warehouse_id: string;
          task_type: string;
          status: string;
          priority: number;
          reference_type: string;
          reference_id: string;
          from_location_id: string | null;
          to_location_id: string | null;
          product_id: string | null;
          quantity: number | null;
          assigned_to: string | null;
          started_at: string | null;
          completed_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          warehouse_id: string;
          task_type: string;
          status?: string;
          priority?: number;
          reference_type: string;
          reference_id: string;
          from_location_id?: string | null;
          to_location_id?: string | null;
          product_id?: string | null;
          quantity?: number | null;
          assigned_to?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          warehouse_id?: string;
          task_type?: string;
          status?: string;
          priority?: number;
          reference_type?: string;
          reference_id?: string;
          from_location_id?: string | null;
          to_location_id?: string | null;
          product_id?: string | null;
          quantity?: number | null;
          assigned_to?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      inventory_movements: {
        Row: {
          id: string;
          tenant_id: string;
          inventory_id: string;
          product_id: string;
          from_location_id: string | null;
          to_location_id: string | null;
          quantity: number;
          movement_type: string;
          reference_type: string | null;
          reference_id: string | null;
          reason: string | null;
          performed_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          inventory_id: string;
          product_id: string;
          from_location_id?: string | null;
          to_location_id?: string | null;
          quantity: number;
          movement_type: string;
          reference_type?: string | null;
          reference_id?: string | null;
          reason?: string | null;
          performed_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          inventory_id?: string;
          product_id?: string;
          from_location_id?: string | null;
          to_location_id?: string | null;
          quantity?: number;
          movement_type?: string;
          reference_type?: string | null;
          reference_id?: string | null;
          reason?: string | null;
          performed_by?: string;
          created_at?: string;
        };
      };
      billing_contracts: {
        Row: {
          id: string;
          tenant_id: string;
          customer_id: string;
          contract_number: string;
          name: string;
          start_date: string;
          end_date: string | null;
          billing_cycle: string;
          rates: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          customer_id: string;
          contract_number: string;
          name: string;
          start_date: string;
          end_date?: string | null;
          billing_cycle?: string;
          rates?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          customer_id?: string;
          contract_number?: string;
          name?: string;
          start_date?: string;
          end_date?: string | null;
          billing_cycle?: string;
          rates?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          tenant_id: string;
          customer_id: string;
          contract_id: string;
          invoice_number: string;
          status: string;
          period_start: string;
          period_end: string;
          subtotal: number;
          tax_amount: number;
          total_amount: number;
          due_date: string;
          paid_date: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          customer_id: string;
          contract_id: string;
          invoice_number: string;
          status?: string;
          period_start: string;
          period_end: string;
          subtotal: number;
          tax_amount?: number;
          total_amount: number;
          due_date: string;
          paid_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          customer_id?: string;
          contract_id?: string;
          invoice_number?: string;
          status?: string;
          period_start?: string;
          period_end?: string;
          subtotal?: number;
          tax_amount?: number;
          total_amount?: number;
          due_date?: string;
          paid_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          tenant_id: string;
          user_id: string;
          action: string;
          entity_type: string;
          entity_id: string;
          details: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          user_id: string;
          action: string;
          entity_type: string;
          entity_id: string;
          details?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          user_id?: string;
          action?: string;
          entity_type?: string;
          entity_id?: string;
          details?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
      ai_conversations: {
        Row: {
          id: string;
          tenant_id: string;
          user_id: string;
          title: string | null;
          context: Json | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          user_id: string;
          title?: string | null;
          context?: Json | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          user_id?: string;
          title?: string | null;
          context?: Json | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: string;
          content: string;
          tool_calls: Json | null;
          tool_results: Json | null;
          tokens_used: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: string;
          content: string;
          tool_calls?: Json | null;
          tool_results?: Json | null;
          tokens_used?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          role?: string;
          content?: string;
          tool_calls?: Json | null;
          tool_results?: Json | null;
          tokens_used?: number | null;
          created_at?: string;
        };
      };
      automation_rules: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          description: string | null;
          trigger_type: string;
          trigger_config: Json;
          conditions: Json;
          actions: Json;
          is_active: boolean;
          last_triggered_at: string | null;
          trigger_count: number;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          description?: string | null;
          trigger_type: string;
          trigger_config: Json;
          conditions?: Json;
          actions: Json;
          is_active?: boolean;
          last_triggered_at?: string | null;
          trigger_count?: number;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          name?: string;
          description?: string | null;
          trigger_type?: string;
          trigger_config?: Json;
          conditions?: Json;
          actions?: Json;
          is_active?: boolean;
          last_triggered_at?: string | null;
          trigger_count?: number;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      automation_logs: {
        Row: {
          id: string;
          rule_id: string;
          tenant_id: string;
          trigger_data: Json;
          conditions_met: boolean;
          actions_executed: Json;
          execution_time_ms: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          rule_id: string;
          tenant_id: string;
          trigger_data: Json;
          conditions_met: boolean;
          actions_executed: Json;
          execution_time_ms: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          rule_id?: string;
          tenant_id?: string;
          trigger_data?: Json;
          conditions_met?: boolean;
          actions_executed?: Json;
          execution_time_ms?: number;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_inventory_stats: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
    };
    Enums: {
      order_status: OrderStatus;
      inbound_order_status: InboundOrderStatus;
      outbound_order_status: OutboundOrderStatus;
      task_status: TaskStatus;
      task_priority: TaskPriority;
      movement_type: MovementType;
      location_type: LocationType;
      storage_type: StorageType;
      inventory_status: InventoryStatus;
      user_role: UserRole;
      automation_trigger: AutomationTrigger;
      automation_action: AutomationAction;
    };
  };
}
