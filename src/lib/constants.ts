/**
 * Application Constants for 3PL WMS
 */

// Status definitions with labels and colors
export const ORDER_STATUSES = {
  draft: { label: 'Concept', color: 'gray' },
  pending: { label: 'In afwachting', color: 'yellow' },
  confirmed: { label: 'Bevestigd', color: 'blue' },
  allocated: { label: 'Gealloceerd', color: 'cyan' },
  released: { label: 'Vrijgegeven', color: 'indigo' },
  wave_assigned: { label: 'Wave toegewezen', color: 'violet' },
  picking: { label: 'Picken', color: 'amber' },
  picked: { label: 'Gepickt', color: 'lime' },
  packing: { label: 'Verpakken', color: 'orange' },
  packed: { label: 'Verpakt', color: 'emerald' },
  staged: { label: 'Klaar voor laden', color: 'teal' },
  loading: { label: 'Laden', color: 'sky' },
  shipped: { label: 'Verzonden', color: 'green' },
  delivered: { label: 'Afgeleverd', color: 'green' },
  cancelled: { label: 'Geannuleerd', color: 'red' },
  on_hold: { label: 'Geblokkeerd', color: 'orange' },
  backordered: { label: 'Backorder', color: 'purple' },
  partial_shipped: { label: 'Deels verzonden', color: 'cyan' },
} as const;

export const INBOUND_STATUSES = {
  draft: { label: 'Concept', color: 'gray' },
  pending: { label: 'In afwachting', color: 'yellow' },
  confirmed: { label: 'Bevestigd', color: 'blue' },
  scheduled: { label: 'Gepland', color: 'indigo' },
  in_transit: { label: 'Onderweg', color: 'indigo' },
  arrived: { label: 'Aangekomen', color: 'cyan' },
  receiving: { label: 'Ontvangen', color: 'amber' },
  quality_check: { label: 'Kwaliteitscontrole', color: 'yellow' },
  partially_received: { label: 'Deels ontvangen', color: 'orange' },
  received: { label: 'Ontvangen', color: 'lime' },
  putaway: { label: 'Wegzetten', color: 'teal' },
  putaway_pending: { label: 'Wacht op wegzetten', color: 'teal' },
  completed: { label: 'Afgerond', color: 'green' },
  cancelled: { label: 'Geannuleerd', color: 'red' },
  on_hold: { label: 'Geblokkeerd', color: 'orange' },
} as const;

export const OUTBOUND_STATUSES = {
  draft: { label: 'Concept', color: 'gray' },
  pending: { label: 'In afwachting', color: 'yellow' },
  confirmed: { label: 'Bevestigd', color: 'blue' },
  allocated: { label: 'Gealloceerd', color: 'cyan' },
  picking: { label: 'Picken', color: 'amber' },
  picked: { label: 'Gepickt', color: 'lime' },
  packing: { label: 'Verpakken', color: 'orange' },
  packed: { label: 'Verpakt', color: 'emerald' },
  shipped: { label: 'Verzonden', color: 'green' },
  delivered: { label: 'Afgeleverd', color: 'green' },
  cancelled: { label: 'Geannuleerd', color: 'red' },
} as const;

export const INVENTORY_STATUSES = {
  available: { label: 'Beschikbaar', color: 'green' },
  hold: { label: 'Geblokkeerd', color: 'orange' },
  damaged: { label: 'Beschadigd', color: 'red' },
  quarantine: { label: 'Quarantaine', color: 'purple' },
  reserved: { label: 'Gereserveerd', color: 'blue' },
  allocated: { label: 'Gealloceerd', color: 'cyan' },
  expired: { label: 'Verlopen', color: 'red' },
  pending_qa: { label: 'Wacht op QC', color: 'yellow' },
} as const;

export const TASK_STATUSES = {
  pending: { label: 'In afwachting', color: 'yellow' },
  assigned: { label: 'Toegewezen', color: 'blue' },
  in_progress: { label: 'In uitvoering', color: 'amber' },
  completed: { label: 'Afgerond', color: 'green' },
  cancelled: { label: 'Geannuleerd', color: 'red' },
} as const;

export const QUALITY_STATUSES = {
  pending: { label: 'In afwachting', color: 'yellow' },
  approved: { label: 'Goedgekeurd', color: 'green' },
  rejected: { label: 'Afgekeurd', color: 'red' },
  conditional: { label: 'Voorwaardelijk', color: 'orange' },
} as const;

export const PRIORITY_LEVELS = {
  critical: { label: 'Kritiek', color: 'red', value: 1 },
  urgent: { label: 'Urgent', color: 'orange', value: 2 },
  high: { label: 'Hoog', color: 'orange', value: 3 },
  normal: { label: 'Normaal', color: 'blue', value: 5 },
  low: { label: 'Laag', color: 'gray', value: 8 },
} as const;

export const USER_ROLES = {
  super_admin: { label: 'Super Admin', permissions: ['*'] },
  admin: { label: 'Administrator', permissions: ['manage_users', 'manage_settings', 'view_all', 'edit_all'] },
  manager: { label: 'Manager', permissions: ['view_all', 'edit_orders', 'approve_adjustments', 'reports'] },
  supervisor: { label: 'Supervisor', permissions: ['view_warehouse', 'edit_tasks', 'manage_operators'] },
  operator: { label: 'Operator', permissions: ['view_tasks', 'execute_tasks', 'scan'] },
  viewer: { label: 'Viewer', permissions: ['view_only'] },
  customer: { label: 'Klant', permissions: ['view_own_orders', 'view_own_inventory'] },
} as const;

export const LOCATION_ZONES = {
  receiving: { label: 'Ontvangst', icon: 'Truck' },
  storage: { label: 'Opslag', icon: 'Package' },
  picking: { label: 'Picken', icon: 'ShoppingCart' },
  shipping: { label: 'Verzending', icon: 'Send' },
  staging: { label: 'Staging', icon: 'Layers' },
  cross_dock: { label: 'Cross-dock', icon: 'ArrowRightLeft' },
  quarantine: { label: 'Quarantaine', icon: 'Shield' },
  returns: { label: 'Retouren', icon: 'RotateCcw' },
  damaged: { label: 'Beschadigd', icon: 'AlertTriangle' },
} as const;

export const LOCATION_TYPES = {
  pallet: { label: 'Pallet', maxHeight: 180 },
  shelf: { label: 'Stelling', maxHeight: 40 },
  bulk: { label: 'Bulk', maxHeight: 300 },
  floor: { label: 'Vloer', maxHeight: null },
  staging: { label: 'Staging', maxHeight: null },
  bin: { label: 'Bin', maxHeight: 30 },
  rack: { label: 'Rek', maxHeight: 200 },
  mezzanine: { label: 'Mezzanine', maxHeight: 180 },
  cold_room: { label: 'Koelcel', maxHeight: 180 },
  freezer: { label: 'Vriezer', maxHeight: 180 },
  pick: { label: 'Picklocatie', maxHeight: 40 },
  receiving: { label: 'Ontvangst', maxHeight: null },
  shipping: { label: 'Verzending', maxHeight: null },
  quarantine: { label: 'Quarantaine', maxHeight: null },
} as const;

export const TEMPERATURE_ZONES = {
  ambient: { label: 'Ambient', minTemp: 15, maxTemp: 25 },
  chilled: { label: 'Gekoeld', minTemp: 2, maxTemp: 8 },
  frozen: { label: 'Diepvries', minTemp: -25, maxTemp: -18 },
  controlled: { label: 'Gecontroleerd', minTemp: 15, maxTemp: 25 },
  hazmat: { label: 'Hazmat', minTemp: null, maxTemp: null },
} as const;

export const STORAGE_TYPES = {
  standard: { label: 'Standaard' },
  cold: { label: 'Gekoeld' },
  frozen: { label: 'Diepvries' },
  hazmat: { label: 'Gevaarlijke stoffen' },
  bonded: { label: 'Douane-entrepot' },
  high_value: { label: 'Hoge waarde' },
} as const;

export const UNITS_OF_MEASURE = {
  EA: { label: 'Stuk', plural: 'Stuks' },
  CS: { label: 'Doos', plural: 'Dozen' },
  PK: { label: 'Pak', plural: 'Pakken' },
  BX: { label: 'Box', plural: 'Boxen' },
  PL: { label: 'Pallet', plural: 'Pallets' },
  KG: { label: 'Kilogram', plural: 'Kilogram' },
  LB: { label: 'Pond', plural: 'Pond' },
  L: { label: 'Liter', plural: 'Liter' },
  M: { label: 'Meter', plural: 'Meter' },
  M2: { label: 'Vierkante meter', plural: 'Vierkante meter' },
  M3: { label: 'Kubieke meter', plural: 'Kubieke meter' },
} as const;

export const CARRIER_TYPES = {
  express: { label: 'Express' },
  freight: { label: 'Vracht' },
  ltl: { label: 'LTL (Less Than Truckload)' },
  ftl: { label: 'FTL (Full Truckload)' },
  parcel: { label: 'Pakket' },
  courier: { label: 'Koerier' },
  postal: { label: 'Post' },
  ocean: { label: 'Zeevracht' },
  air: { label: 'Luchtvracht' },
} as const;

export const SERVICE_CATEGORIES = {
  storage: { label: 'Opslag' },
  handling_in: { label: 'Inbound Handling' },
  handling_out: { label: 'Outbound Handling' },
  pick_pack: { label: 'Pick & Pack' },
  val_service: { label: 'VAL Services' },
  returns: { label: 'Retouren' },
  shipping: { label: 'Verzending' },
  other: { label: 'Overig' },
} as const;

export const VAL_SERVICE_TYPES = {
  labeling: { label: 'Labelen' },
  relabeling: { label: 'Herlabelen' },
  kitting: { label: 'Kitting' },
  assembly: { label: 'Assemblage' },
  disassembly: { label: 'Demontage' },
  repacking: { label: 'Herverpakken' },
  quality_check: { label: 'Kwaliteitscontrole' },
  rework: { label: 'Rework' },
  gift_wrapping: { label: 'Cadeau verpakken' },
  bundling: { label: 'Bundelen' },
  inspection: { label: 'Inspectie' },
  testing: { label: 'Testen' },
  documentation: { label: 'Documentatie' },
  custom: { label: 'Maatwerk' },
} as const;

export const INVOICE_STATUSES = {
  draft: { label: 'Concept', color: 'gray' },
  pending_review: { label: 'Ter beoordeling', color: 'yellow' },
  approved: { label: 'Goedgekeurd', color: 'blue' },
  sent: { label: 'Verzonden', color: 'indigo' },
  viewed: { label: 'Bekeken', color: 'cyan' },
  paid: { label: 'Betaald', color: 'green' },
  partial_paid: { label: 'Deels betaald', color: 'lime' },
  overdue: { label: 'Verlopen', color: 'red' },
  disputed: { label: 'Betwist', color: 'orange' },
  cancelled: { label: 'Geannuleerd', color: 'gray' },
  written_off: { label: 'Afgeschreven', color: 'red' },
} as const;

export const WAVE_STATUSES = {
  draft: { label: 'Concept', color: 'gray' },
  released: { label: 'Vrijgegeven', color: 'blue' },
  in_progress: { label: 'In uitvoering', color: 'amber' },
  completed: { label: 'Afgerond', color: 'green' },
  cancelled: { label: 'Geannuleerd', color: 'red' },
} as const;

export const MOVEMENT_TYPES = {
  receive: { label: 'Ontvangst' },
  putaway: { label: 'Wegzetten' },
  pick: { label: 'Picken' },
  transfer: { label: 'Verplaatsen' },
  adjustment: { label: 'Aanpassing' },
  count: { label: 'Telling' },
  ship: { label: 'Verzenden' },
} as const;

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// API configuration
export const API_TIMEOUT = 30000; // 30 seconds
export const MAX_RETRIES = 3;

// File upload limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Date formats
export const DATE_FORMAT = 'dd-MM-yyyy';
export const DATETIME_FORMAT = 'dd-MM-yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';
export const ISO_DATE_FORMAT = 'yyyy-MM-dd';

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  search: 'ctrl+k',
  save: 'ctrl+s',
  new: 'ctrl+n',
  close: 'escape',
  help: 'ctrl+/',
} as const;

// Automation triggers
export const AUTOMATION_TRIGGERS = {
  inventory_low: { label: 'Voorraad laag' },
  order_created: { label: 'Order aangemaakt' },
  order_status_changed: { label: 'Order status gewijzigd' },
  stock_expiring: { label: 'Voorraad verloopt' },
  task_overdue: { label: 'Taak te laat' },
  schedule: { label: 'Schema' },
} as const;

// Automation actions
export const AUTOMATION_ACTIONS = {
  send_notification: { label: 'Verstuur notificatie' },
  create_task: { label: 'Maak taak aan' },
  update_priority: { label: 'Update prioriteit' },
  send_email: { label: 'Verstuur e-mail' },
  webhook: { label: 'Webhook' },
  create_report: { label: 'Maak rapport aan' },
} as const;
