// ============================================================================
// Enterprise 3PL WMS - Type Definitions
// ============================================================================

export * from './database';

// Base types
export type UUID = string;
export type ISODateString = string;

// Re-export commonly used types
export type {
  Json,
  Database,
  OrderStatus,
  InboundOrderStatus,
  OutboundOrderStatus,
  TaskStatus,
  TaskType,
  TaskPriority,
  LocationType,
  StorageType,
  InventoryStatus,
  InvoiceStatus,
  UserRole,
  MovementType,
  AutomationTrigger,
  AutomationAction,
} from './database';

// ============================================================================
// User & Authentication
// ============================================================================

export interface User {
  id: UUID;
  auth_id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'admin' | 'manager' | 'supervisor' | 'operator' | 'viewer' | 'customer';
  tenant_id: UUID;
  warehouse_ids: UUID[];
  settings: UserSettings;
  is_active: boolean;
  last_login_at?: ISODateString;
  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  language: string;
}

export interface AuthSession {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

// ============================================================================
// Tenant & Multi-tenancy
// ============================================================================

export interface Tenant {
  id: UUID;
  name: string;
  slug: string;
  code: string;
  settings: TenantSettings;
  is_active: boolean;
  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface TenantSettings {
  timezone: string;
  dateFormat: string;
  date_format: string;
  currency: string;
  language: string;
  features: {
    ai_enabled: boolean;
    aiAssistant: boolean;
    automation: boolean;
    realtime_enabled: boolean;
    lot_tracking: boolean;
    lotTracking: boolean;
    serial_tracking: boolean;
    serialTracking: boolean;
    expiry_tracking: boolean;
    expiryTracking: boolean;
  };
}

// ============================================================================
// Warehouse & Locations
// ============================================================================

export interface Warehouse {
  id: UUID;
  tenant_id: UUID;
  code: string;
  name: string;
  address: Address;
  contact: ContactInfo;
  settings: WarehouseSettings;
  is_active: boolean;
  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface WarehouseSettings {
  operating_hours: {
    start: string;
    end: string;
    days: number[];
  };
  default_putaway_strategy: 'fifo' | 'lifo' | 'fefo' | 'closest_empty';
  default_pick_strategy: 'fifo' | 'lifo' | 'fefo' | 'closest';
  enforce_lot_tracking: boolean;
  enforce_expiry_tracking: boolean;
}

export interface Zone {
  id: UUID;
  warehouse_id: UUID;
  code: string;
  name: string;
  zone_type: string;
  settings?: Record<string, unknown>;
  is_active: boolean;
  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface Location {
  id: UUID;
  warehouse_id: UUID;
  zone_id: UUID;
  code: string;
  name: string;
  aisle: string;
  rack: string;
  level: string;
  position: string;
  location_type: string;
  storage_type: string;
  max_weight?: number;
  max_volume?: number;
  max_capacity?: number;
  current_weight?: number;
  current_volume?: number;
  current_utilization: number;
  is_active: boolean;
  is_pickable: boolean;
  is_storable: boolean;
  is_available: boolean;
  pick_sequence?: number;
  created_at: ISODateString;
  updated_at: ISODateString;
  // Relations
  zone?: Zone;
}

// ============================================================================
// Customers
// ============================================================================

export interface Customer {
  id: UUID;
  tenant_id: UUID;
  code: string;
  name: string;
  type: 'company' | 'individual';
  billing_address: Address;
  shipping_address?: Address;
  contact: ContactInfo;
  settings: CustomerSettings;
  is_active: boolean;
  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface CustomerSettings {
  default_warehouse_id?: UUID;
  billing_contract_id?: UUID;
  notification_preferences: {
    email_on_receipt: boolean;
    email_on_ship: boolean;
    email_on_low_stock: boolean;
  };
  custom_fields?: Record<string, unknown>;
}

export interface Address {
  line1: string;
  line2?: string;
  street1?: string;
  street2?: string;
  city: string;
  state?: string;
  postal_code?: string;
  postalCode?: string;
  country: string;
  phone?: string;
  email?: string;
  name?: string;
}

export interface ContactInfo {
  name?: string;
  email?: string;
  phone?: string;
}

// ============================================================================
// Products
// ============================================================================

export interface Product {
  id: UUID;
  tenant_id: UUID;
  customer_id?: UUID;
  sku: string;
  name: string;
  description?: string;
  barcode?: string;
  upc?: string;
  category?: string;
  unit_of_measure: string;
  weight?: number;
  weight_unit?: string;
  length?: number;
  width?: number;
  height?: number;
  storage_requirements?: string;
  min_stock_level?: number;
  max_stock_level?: number;
  reorder_point?: number;
  requires_lot_tracking: boolean;
  requires_serial_tracking: boolean;
  requires_expiry_tracking: boolean;
  shelf_life_days?: number;
  image_url?: string;
  metadata?: Record<string, unknown>;
  is_active: boolean;
  created_at: ISODateString;
  updated_at: ISODateString;
  // Relations
  customer?: Customer;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: string;
}

// ============================================================================
// Inventory
// ============================================================================

export interface InventoryItem {
  id: UUID;
  tenant_id: UUID;
  warehouse_id: UUID;
  location_id: UUID;
  product_id: UUID;
  lot_number?: string;
  serial_number?: string;
  expiry_date?: ISODateString;
  quantity: number;
  quantity_on_hand: number;
  quantity_reserved: number;
  quantity_available: number;
  status: string;
  received_at: ISODateString;
  received_date: ISODateString;
  unit_cost?: number;
  cost_price?: number;
  created_at: ISODateString;
  updated_at: ISODateString;
  // Relations
  product?: Product;
  location?: Location;
  warehouse?: Warehouse;
}

export interface InventoryMovement {
  id: UUID;
  tenant_id: UUID;
  inventory_id: UUID;
  product_id: UUID;
  movement_type: string;
  quantity: number;
  from_location_id?: UUID;
  to_location_id?: UUID;
  reference_type?: string;
  reference_id?: UUID;
  reason?: string;
  performed_by: UUID;
  created_at: ISODateString;
  // Relations
  product?: Product;
  from_location?: Location;
  to_location?: Location;
  performed_by_user?: User;
}

// ============================================================================
// Inbound Orders
// ============================================================================

export interface InboundOrder {
  id: UUID;
  tenant_id: UUID;
  warehouse_id: UUID;
  customer_id: UUID;
  order_number: string;
  external_reference?: string;
  reference_number?: string;
  supplier_id?: string;
  supplier_name?: string;
  supplier_reference?: string;
  status: string;
  priority: string;
  expected_date?: ISODateString;
  received_date?: ISODateString;
  notes?: string;
  metadata?: Record<string, unknown>;
  created_by: UUID;
  created_at: ISODateString;
  updated_at: ISODateString;
  // Relations
  customer?: Customer;
  warehouse?: Warehouse;
  lines?: InboundOrderLine[];
}

export interface InboundOrderLine {
  id: UUID;
  inbound_order_id: UUID;
  order_id: UUID;
  product_id: UUID;
  line_number: number;
  expected_quantity: number;
  received_quantity: number;
  lot_number?: string;
  expiry_date?: ISODateString;
  unit_cost?: number;
  notes?: string;
  created_at: ISODateString;
  // Relations
  product?: Product;
}

// ============================================================================
// Outbound Orders
// ============================================================================

export interface OutboundOrder {
  id: UUID;
  tenant_id: UUID;
  warehouse_id: UUID;
  customer_id: UUID;
  order_number: string;
  external_reference?: string;
  reference_number?: string;
  customer_reference?: string;
  status: string;
  priority: string;
  order_date: ISODateString;
  required_date?: ISODateString;
  ship_date?: ISODateString;
  shipped_date?: ISODateString;
  ship_to_address: Address;
  shipping_method?: string;
  tracking_number?: string;
  notes?: string;
  wave_id?: UUID;
  metadata?: Record<string, unknown>;
  created_by: UUID;
  created_at: ISODateString;
  updated_at: ISODateString;
  // Relations
  customer?: Customer;
  warehouse?: Warehouse;
  lines?: OutboundOrderLine[];
}

export interface OutboundOrderLine {
  id: UUID;
  outbound_order_id: UUID;
  order_id: UUID;
  product_id: UUID;
  line_number: number;
  ordered_quantity: number;
  requested_quantity: number;
  allocated_quantity: number;
  picked_quantity: number;
  shipped_quantity: number;
  lot_number?: string;
  serial_number?: string;
  notes?: string;
  created_at: ISODateString;
  // Relations
  product?: Product;
  allocations?: InventoryAllocation[];
}

export interface InventoryAllocation {
  id: UUID;
  outbound_order_line_id: UUID;
  inventory_id: UUID;
  location_id: UUID;
  quantity: number;
  picked_quantity: number;
  status: 'allocated' | 'picking' | 'picked' | 'cancelled';
  created_at: ISODateString;
  // Relations
  inventory?: InventoryItem;
  location?: Location;
}

// ============================================================================
// Wave & Task Management
// ============================================================================

export interface Wave {
  id: UUID;
  warehouse_id: UUID;
  wave_number: string;
  status: 'draft' | 'released' | 'in_progress' | 'completed' | 'cancelled';
  order_count: number;
  line_count: number;
  start_time?: ISODateString;
  end_time?: ISODateString;
  created_by: UUID;
  created_at: ISODateString;
  updated_at: ISODateString;
  // Relations
  orders?: OutboundOrder[];
}

export interface Task {
  id: UUID;
  warehouse_id: UUID;
  task_type: string;
  status: string;
  priority: number;
  reference_type: string;
  reference_id: UUID;
  from_location_id?: UUID;
  to_location_id?: UUID;
  product_id?: UUID;
  quantity?: number;
  assigned_to?: UUID;
  started_at?: ISODateString;
  completed_at?: ISODateString;
  notes?: string;
  created_at: ISODateString;
  updated_at: ISODateString;
  // Relations
  from_location?: Location;
  to_location?: Location;
  product?: Product;
  assignee?: User;
}

export interface PickTask {
  id: UUID;
  tenant_id: UUID;
  warehouse_id: UUID;
  order_id: UUID;
  order_line_id: UUID;
  inventory_id: UUID;
  from_location_id: UUID;
  to_location_id?: UUID;
  product_id: UUID;
  quantity: number;
  picked_quantity: number;
  status: string;
  priority: string;
  assigned_to?: UUID;
  assigned_at?: ISODateString;
  started_at?: ISODateString;
  completed_at?: ISODateString;
  pick_sequence: number;
  notes?: string;
  created_at: ISODateString;
  updated_at: ISODateString;
  // Relations
  product?: Product;
  from_location?: Location;
  to_location?: Location;
  assigned_user?: User;
  order?: OutboundOrder;
}

// ============================================================================
// Billing & Contracts
// ============================================================================

export interface BillingContract {
  id: UUID;
  tenant_id: UUID;
  customer_id: UUID;
  contract_number: string;
  name: string;
  start_date: ISODateString;
  end_date?: ISODateString;
  billing_cycle: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  rates: BillingRate[];
  is_active: boolean;
  created_at: ISODateString;
  updated_at: ISODateString;
  // Relations
  customer?: Customer;
}

export interface BillingRate {
  id: UUID;
  contract_id: UUID;
  charge_type: 'storage' | 'handling_in' | 'handling_out' | 'pick' | 'pack' | 'vas' | 'shipping';
  name: string;
  unit: string;
  rate: number;
  min_charge?: number;
  conditions?: Record<string, unknown>;
}

export interface Invoice {
  id: UUID;
  tenant_id: UUID;
  customer_id: UUID;
  contract_id: UUID;
  invoice_number: string;
  status: string;
  period_start: ISODateString;
  period_end: ISODateString;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  due_date: ISODateString;
  paid_date?: ISODateString;
  notes?: string;
  created_at: ISODateString;
  updated_at: ISODateString;
  // Relations
  customer?: Customer;
  lines?: InvoiceLine[];
}

export interface InvoiceLine {
  id: UUID;
  invoice_id: UUID;
  charge_type: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total: number;
}

export interface StorageCharge {
  id: UUID;
  tenant_id: UUID;
  customer_id: UUID;
  warehouse_id: UUID;
  product_id?: UUID;
  charge_date: ISODateString;
  quantity: number;
  rate: number;
  amount: number;
  invoiced: boolean;
  invoice_id?: UUID;
  created_at: ISODateString;
}

// ============================================================================
// Activity & Audit
// ============================================================================

export interface ActivityLog {
  id: UUID;
  tenant_id: UUID;
  user_id: UUID;
  action: string;
  entity_type: string;
  entity_id: UUID;
  details?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: ISODateString;
  // Relations
  user?: User;
}

// ============================================================================
// AI & Automation
// ============================================================================

export interface AIConversation {
  id: UUID;
  tenant_id: UUID;
  user_id: UUID;
  title?: string;
  context?: Record<string, unknown>;
  is_active: boolean;
  created_at: ISODateString;
  updated_at: ISODateString;
  // Relations
  messages?: AIMessage[];
}

export interface AIMessage {
  id: UUID;
  conversation_id: UUID;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tool_calls?: AIToolCall[];
  tool_results?: AIToolResult[];
  tokens_used?: number;
  created_at: ISODateString;
}

export interface AIToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface AIToolResult {
  tool_use_id: string;
  content: string;
  is_error?: boolean;
}

export interface AutomationRule {
  id: UUID;
  tenant_id: UUID;
  name: string;
  description?: string;
  trigger_type: string;
  trigger_config: AutomationTriggerConfig;
  conditions: AutomationCondition[];
  actions: AutomationActionConfig[];
  is_active: boolean;
  last_triggered_at?: ISODateString;
  trigger_count: number;
  created_by: UUID;
  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface AutomationTriggerConfig {
  event?: string;
  schedule?: string;
  threshold?: number;
  field?: string;
  operator?: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value?: string | number | boolean;
}

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'not_in';
  value: string | number | boolean | string[];
  logic?: 'and' | 'or';
}

export interface AutomationActionConfig {
  type: string;
  config: {
    title?: string;
    message?: string;
    recipients?: string[];
    channels?: ('email' | 'push' | 'in_app')[];
    taskType?: string;
    priority?: string;
    assignTo?: string;
    newPriority?: string;
    url?: string;
    method?: 'GET' | 'POST' | 'PUT';
    headers?: Record<string, string>;
    body?: Record<string, unknown>;
    reportType?: string;
  };
}

export interface AutomationLog {
  id: UUID;
  rule_id: UUID;
  tenant_id: UUID;
  trigger_data: Record<string, unknown>;
  conditions_met: boolean;
  actions_executed: {
    action_type: string;
    success: boolean;
    result?: Record<string, unknown>;
    error?: string;
  }[];
  execution_time_ms: number;
  created_at: ISODateString;
}

// ============================================================================
// Dashboard & Reports
// ============================================================================

export interface DashboardStats {
  pendingInbound: number;
  pendingOutbound: number;
  pendingPicks: number;
  inventoryStats: InventoryStats;
}

export interface InventoryStats {
  total_products: number;
  total_units: number;
  occupancy_percentage: number;
  zones: ZoneCapacity[];
}

export interface ZoneCapacity {
  zone_id: UUID;
  zone_name: string;
  total_locations: number;
  occupied_locations: number;
  occupancy_percentage: number;
}

export interface OrdersTrend {
  date: string;
  inbound: number;
  outbound: number;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiMeta {
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
}

// ============================================================================
// Search & Filter Types
// ============================================================================

export interface SearchFilters {
  query?: string;
  status?: string | string[];
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface InventorySearchFilters extends SearchFilters {
  productId?: string;
  productSku?: string;
  locationId?: string;
  warehouseId?: string;
  lotNumber?: string;
  includeZeroStock?: boolean;
  expiringWithinDays?: number;
}

export interface OrderSearchFilters extends SearchFilters {
  orderNumber?: string;
  customerId?: string;
  supplierId?: string;
  warehouseId?: string;
  priority?: string;
}

// ============================================================================
// Form Types
// ============================================================================

export interface InboundOrderFormData {
  warehouse_id: UUID;
  customer_id: UUID;
  reference_number?: string;
  supplier_reference?: string;
  expected_date?: string;
  notes?: string;
  lines: InboundOrderLineFormData[];
}

export interface InboundOrderLineFormData {
  product_id: UUID;
  expected_quantity: number;
  lot_number?: string;
  expiry_date?: string;
  notes?: string;
}

export interface OutboundOrderFormData {
  warehouse_id: UUID;
  customer_id: UUID;
  reference_number?: string;
  customer_reference?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  required_date?: string;
  ship_to_address: Address;
  shipping_method?: string;
  notes?: string;
  lines: OutboundOrderLineFormData[];
}

export interface OutboundOrderLineFormData {
  product_id: UUID;
  ordered_quantity: number;
  lot_number?: string;
  notes?: string;
}
