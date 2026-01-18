import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xhrklsducxilrfrgbczp.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhocmtsc2R1Y3hpbHJmcmdiY3pwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODc0NjYzMSwiZXhwIjoyMDg0MzIyNjMxfQ.qx2D9etXR0JZUJvskzq_rQ_FXSY6ZrnukEDPLN0lIEs';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function insertData(table, data) {
  const { error } = await supabase.from(table).insert(data);
  if (error) {
    console.log(`Error inserting into ${table}:`, error.message);
    return false;
  }
  console.log(`✓ Inserted into ${table}`);
  return true;
}

async function runSeed() {
  console.log('Starting seed data insertion...\n');

  // 1. Tenant
  await insertData('tenants', {
    id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Demo Logistics BV',
    slug: 'demo-logistics',
    code: 'DEMO',
    settings: { timezone: 'Europe/Amsterdam', currency: 'EUR', language: 'nl' }
  });

  // 2. Users
  await insertData('users', [
    { id: 'b0000000-0000-0000-0000-000000000001', tenant_id: 'a0000000-0000-0000-0000-000000000001', email: 'admin@demo.com', full_name: 'Admin User', role: 'admin', is_active: true },
    { id: 'b0000000-0000-0000-0000-000000000002', tenant_id: 'a0000000-0000-0000-0000-000000000001', email: 'manager@demo.com', full_name: 'Warehouse Manager', role: 'manager', is_active: true },
    { id: 'b0000000-0000-0000-0000-000000000003', tenant_id: 'a0000000-0000-0000-0000-000000000001', email: 'operator@demo.com', full_name: 'Floor Operator', role: 'operator', is_active: true }
  ]);

  // 3. Warehouses
  await insertData('warehouses', [
    { id: 'c0000000-0000-0000-0000-000000000001', tenant_id: 'a0000000-0000-0000-0000-000000000001', code: 'WH-AMS', name: 'Amsterdam DC', address: { street: 'Industrieweg 42', city: 'Amsterdam', postal_code: '1099 AB', country: 'NL' }, is_active: true },
    { id: 'c0000000-0000-0000-0000-000000000002', tenant_id: 'a0000000-0000-0000-0000-000000000001', code: 'WH-RTM', name: 'Rotterdam DC', address: { street: 'Havenstraat 15', city: 'Rotterdam', postal_code: '3011 TA', country: 'NL' }, is_active: true }
  ]);

  // 4. Zones
  await insertData('zones', [
    { id: 'd0000000-0000-0000-0000-000000000001', warehouse_id: 'c0000000-0000-0000-0000-000000000001', code: 'RECV', name: 'Receiving', zone_type: 'standard', is_active: true },
    { id: 'd0000000-0000-0000-0000-000000000002', warehouse_id: 'c0000000-0000-0000-0000-000000000001', code: 'BULK', name: 'Bulk Storage', zone_type: 'standard', is_active: true },
    { id: 'd0000000-0000-0000-0000-000000000003', warehouse_id: 'c0000000-0000-0000-0000-000000000001', code: 'PICK', name: 'Pick Zone', zone_type: 'standard', is_active: true },
    { id: 'd0000000-0000-0000-0000-000000000004', warehouse_id: 'c0000000-0000-0000-0000-000000000001', code: 'SHIP', name: 'Shipping', zone_type: 'standard', is_active: true },
    { id: 'd0000000-0000-0000-0000-000000000005', warehouse_id: 'c0000000-0000-0000-0000-000000000001', code: 'COLD', name: 'Cold Storage', zone_type: 'cold', is_active: true }
  ]);

  // 5. Locations
  await insertData('locations', [
    // Receiving
    { id: 'e0000000-0000-0000-0000-000000000001', warehouse_id: 'c0000000-0000-0000-0000-000000000001', zone_id: 'd0000000-0000-0000-0000-000000000001', code: 'RECV-DOCK-01', name: 'Receiving Dock 1', location_type: 'receiving', aisle: 'RECV', rack: '01', level: '00', position: '01', pick_sequence: 1 },
    { id: 'e0000000-0000-0000-0000-000000000002', warehouse_id: 'c0000000-0000-0000-0000-000000000001', zone_id: 'd0000000-0000-0000-0000-000000000001', code: 'RECV-DOCK-02', name: 'Receiving Dock 2', location_type: 'receiving', aisle: 'RECV', rack: '02', level: '00', position: '01', pick_sequence: 2 },
    // Bulk storage
    { id: 'e0000000-0000-0000-0000-000000000010', warehouse_id: 'c0000000-0000-0000-0000-000000000001', zone_id: 'd0000000-0000-0000-0000-000000000002', code: 'A-01-01-01', name: 'Aisle A Rack 1 Level 1 Pos 1', location_type: 'storage', aisle: 'A', rack: '01', level: '01', position: '01', pick_sequence: 10 },
    { id: 'e0000000-0000-0000-0000-000000000011', warehouse_id: 'c0000000-0000-0000-0000-000000000001', zone_id: 'd0000000-0000-0000-0000-000000000002', code: 'A-01-01-02', name: 'Aisle A Rack 1 Level 1 Pos 2', location_type: 'storage', aisle: 'A', rack: '01', level: '01', position: '02', pick_sequence: 11 },
    { id: 'e0000000-0000-0000-0000-000000000012', warehouse_id: 'c0000000-0000-0000-0000-000000000001', zone_id: 'd0000000-0000-0000-0000-000000000002', code: 'A-01-02-01', name: 'Aisle A Rack 1 Level 2 Pos 1', location_type: 'storage', aisle: 'A', rack: '01', level: '02', position: '01', pick_sequence: 12 },
    { id: 'e0000000-0000-0000-0000-000000000013', warehouse_id: 'c0000000-0000-0000-0000-000000000001', zone_id: 'd0000000-0000-0000-0000-000000000002', code: 'A-01-02-02', name: 'Aisle A Rack 1 Level 2 Pos 2', location_type: 'storage', aisle: 'A', rack: '01', level: '02', position: '02', pick_sequence: 13 },
    { id: 'e0000000-0000-0000-0000-000000000014', warehouse_id: 'c0000000-0000-0000-0000-000000000001', zone_id: 'd0000000-0000-0000-0000-000000000002', code: 'A-02-01-01', name: 'Aisle A Rack 2 Level 1 Pos 1', location_type: 'storage', aisle: 'A', rack: '02', level: '01', position: '01', pick_sequence: 14 },
    { id: 'e0000000-0000-0000-0000-000000000015', warehouse_id: 'c0000000-0000-0000-0000-000000000001', zone_id: 'd0000000-0000-0000-0000-000000000002', code: 'A-02-01-02', name: 'Aisle A Rack 2 Level 1 Pos 2', location_type: 'storage', aisle: 'A', rack: '02', level: '01', position: '02', pick_sequence: 15 },
    // Pick zone
    { id: 'e0000000-0000-0000-0000-000000000020', warehouse_id: 'c0000000-0000-0000-0000-000000000001', zone_id: 'd0000000-0000-0000-0000-000000000003', code: 'P-01-01-01', name: 'Pick Zone 1', location_type: 'picking', aisle: 'P', rack: '01', level: '01', position: '01', pick_sequence: 100 },
    { id: 'e0000000-0000-0000-0000-000000000021', warehouse_id: 'c0000000-0000-0000-0000-000000000001', zone_id: 'd0000000-0000-0000-0000-000000000003', code: 'P-01-01-02', name: 'Pick Zone 2', location_type: 'picking', aisle: 'P', rack: '01', level: '01', position: '02', pick_sequence: 101 },
    { id: 'e0000000-0000-0000-0000-000000000022', warehouse_id: 'c0000000-0000-0000-0000-000000000001', zone_id: 'd0000000-0000-0000-0000-000000000003', code: 'P-01-01-03', name: 'Pick Zone 3', location_type: 'picking', aisle: 'P', rack: '01', level: '01', position: '03', pick_sequence: 102 },
    { id: 'e0000000-0000-0000-0000-000000000023', warehouse_id: 'c0000000-0000-0000-0000-000000000001', zone_id: 'd0000000-0000-0000-0000-000000000003', code: 'P-01-01-04', name: 'Pick Zone 4', location_type: 'picking', aisle: 'P', rack: '01', level: '01', position: '04', pick_sequence: 103 },
    // Shipping
    { id: 'e0000000-0000-0000-0000-000000000030', warehouse_id: 'c0000000-0000-0000-0000-000000000001', zone_id: 'd0000000-0000-0000-0000-000000000004', code: 'SHIP-DOCK-01', name: 'Shipping Dock 1', location_type: 'shipping', aisle: 'SHIP', rack: '01', level: '00', position: '01', pick_sequence: 200 },
    { id: 'e0000000-0000-0000-0000-000000000031', warehouse_id: 'c0000000-0000-0000-0000-000000000001', zone_id: 'd0000000-0000-0000-0000-000000000004', code: 'SHIP-DOCK-02', name: 'Shipping Dock 2', location_type: 'shipping', aisle: 'SHIP', rack: '02', level: '00', position: '01', pick_sequence: 201 }
  ]);

  // 6. Customers
  await insertData('customers', [
    { id: 'f0000000-0000-0000-0000-000000000001', tenant_id: 'a0000000-0000-0000-0000-000000000001', code: 'CUST-001', name: 'TechStore Nederland BV', type: 'company', billing_address: { street: 'Winkelstraat 100', city: 'Utrecht', postal_code: '3512 JK', country: 'NL' }, contact: { email: 'logistics@techstore.nl', phone: '+31 30 123 4567', contact_person: 'Jan de Vries' }, is_active: true },
    { id: 'f0000000-0000-0000-0000-000000000002', tenant_id: 'a0000000-0000-0000-0000-000000000001', code: 'CUST-002', name: 'Fashion Forward BV', type: 'company', billing_address: { street: 'Modeplein 25', city: 'Amsterdam', postal_code: '1012 AB', country: 'NL' }, contact: { email: 'warehouse@fashionforward.nl', phone: '+31 20 987 6543', contact_person: 'Lisa Jansen' }, is_active: true },
    { id: 'f0000000-0000-0000-0000-000000000003', tenant_id: 'a0000000-0000-0000-0000-000000000001', code: 'CUST-003', name: 'Home Goods Import', type: 'company', billing_address: { street: 'Importweg 8', city: 'Rotterdam', postal_code: '3089 JB', country: 'NL' }, contact: { email: 'supply@homegoods.nl', phone: '+31 10 555 1234', contact_person: 'Pieter Bakker' }, is_active: true }
  ]);

  // 7. Products
  await insertData('products', [
    // TechStore
    { id: '10000000-0000-0000-0000-000000000001', tenant_id: 'a0000000-0000-0000-0000-000000000001', customer_id: 'f0000000-0000-0000-0000-000000000001', sku: 'TECH-LAPTOP-001', barcode: '8710000000001', name: 'Laptop Pro 15"', description: '15 inch laptop met SSD', category: 'Electronics', unit_of_measure: 'EA', weight: 2.5, storage_requirements: 'standard' },
    { id: '10000000-0000-0000-0000-000000000002', tenant_id: 'a0000000-0000-0000-0000-000000000001', customer_id: 'f0000000-0000-0000-0000-000000000001', sku: 'TECH-PHONE-001', barcode: '8710000000002', name: 'Smartphone X12', description: 'High-end smartphone', category: 'Electronics', unit_of_measure: 'EA', weight: 0.2, storage_requirements: 'standard' },
    { id: '10000000-0000-0000-0000-000000000003', tenant_id: 'a0000000-0000-0000-0000-000000000001', customer_id: 'f0000000-0000-0000-0000-000000000001', sku: 'TECH-TABLET-001', barcode: '8710000000003', name: 'Tablet Air 10"', description: '10 inch tablet', category: 'Electronics', unit_of_measure: 'EA', weight: 0.5, storage_requirements: 'standard' },
    { id: '10000000-0000-0000-0000-000000000004', tenant_id: 'a0000000-0000-0000-0000-000000000001', customer_id: 'f0000000-0000-0000-0000-000000000001', sku: 'TECH-CHARGER-001', barcode: '8710000000004', name: 'Universal Charger', description: '65W USB-C charger', category: 'Accessories', unit_of_measure: 'EA', weight: 0.15, storage_requirements: 'standard' },
    // Fashion
    { id: '10000000-0000-0000-0000-000000000010', tenant_id: 'a0000000-0000-0000-0000-000000000001', customer_id: 'f0000000-0000-0000-0000-000000000002', sku: 'FASH-SHIRT-BLU-M', barcode: '8720000000010', name: 'T-Shirt Blauw M', description: 'Katoenen t-shirt blauw maat M', category: 'Apparel', unit_of_measure: 'EA', weight: 0.2, storage_requirements: 'standard' },
    { id: '10000000-0000-0000-0000-000000000011', tenant_id: 'a0000000-0000-0000-0000-000000000001', customer_id: 'f0000000-0000-0000-0000-000000000002', sku: 'FASH-SHIRT-BLU-L', barcode: '8720000000011', name: 'T-Shirt Blauw L', description: 'Katoenen t-shirt blauw maat L', category: 'Apparel', unit_of_measure: 'EA', weight: 0.22, storage_requirements: 'standard' },
    { id: '10000000-0000-0000-0000-000000000012', tenant_id: 'a0000000-0000-0000-0000-000000000001', customer_id: 'f0000000-0000-0000-0000-000000000002', sku: 'FASH-JEANS-32', barcode: '8720000000012', name: 'Jeans Classic 32', description: 'Classic fit jeans maat 32', category: 'Apparel', unit_of_measure: 'EA', weight: 0.6, storage_requirements: 'standard' },
    { id: '10000000-0000-0000-0000-000000000013', tenant_id: 'a0000000-0000-0000-0000-000000000001', customer_id: 'f0000000-0000-0000-0000-000000000002', sku: 'FASH-JACKET-M', barcode: '8720000000013', name: 'Winter Jacket M', description: 'Winterjas maat M', category: 'Apparel', unit_of_measure: 'EA', weight: 1.2, storage_requirements: 'standard' },
    // Home Goods
    { id: '10000000-0000-0000-0000-000000000020', tenant_id: 'a0000000-0000-0000-0000-000000000001', customer_id: 'f0000000-0000-0000-0000-000000000003', sku: 'HOME-LAMP-001', barcode: '8730000000020', name: 'Tafellamp Modern', description: 'LED tafellamp design', category: 'Lighting', unit_of_measure: 'EA', weight: 1.5, storage_requirements: 'standard' },
    { id: '10000000-0000-0000-0000-000000000021', tenant_id: 'a0000000-0000-0000-0000-000000000001', customer_id: 'f0000000-0000-0000-0000-000000000003', sku: 'HOME-CUSHION-001', barcode: '8730000000021', name: 'Sierkussen Grijs', description: 'Sierkussen 45x45cm grijs', category: 'Textiles', unit_of_measure: 'EA', weight: 0.4, storage_requirements: 'standard' },
    { id: '10000000-0000-0000-0000-000000000022', tenant_id: 'a0000000-0000-0000-0000-000000000001', customer_id: 'f0000000-0000-0000-0000-000000000003', sku: 'HOME-VASE-001', barcode: '8730000000022', name: 'Vaas Keramiek', description: 'Keramieke vaas 30cm', category: 'Decor', unit_of_measure: 'EA', weight: 0.8, storage_requirements: 'standard' }
  ]);

  // 8. Inventory
  await insertData('inventory', [
    { id: '20000000-0000-0000-0000-000000000001', tenant_id: 'a0000000-0000-0000-0000-000000000001', warehouse_id: 'c0000000-0000-0000-0000-000000000001', location_id: 'e0000000-0000-0000-0000-000000000020', product_id: '10000000-0000-0000-0000-000000000001', quantity: 25, quantity_on_hand: 25, quantity_available: 25, status: 'available' },
    { id: '20000000-0000-0000-0000-000000000002', tenant_id: 'a0000000-0000-0000-0000-000000000001', warehouse_id: 'c0000000-0000-0000-0000-000000000001', location_id: 'e0000000-0000-0000-0000-000000000021', product_id: '10000000-0000-0000-0000-000000000002', quantity: 100, quantity_on_hand: 100, quantity_available: 100, status: 'available' },
    { id: '20000000-0000-0000-0000-000000000003', tenant_id: 'a0000000-0000-0000-0000-000000000001', warehouse_id: 'c0000000-0000-0000-0000-000000000001', location_id: 'e0000000-0000-0000-0000-000000000022', product_id: '10000000-0000-0000-0000-000000000003', quantity: 40, quantity_on_hand: 40, quantity_available: 40, status: 'available' },
    { id: '20000000-0000-0000-0000-000000000004', tenant_id: 'a0000000-0000-0000-0000-000000000001', warehouse_id: 'c0000000-0000-0000-0000-000000000001', location_id: 'e0000000-0000-0000-0000-000000000010', product_id: '10000000-0000-0000-0000-000000000004', quantity: 200, quantity_on_hand: 200, quantity_available: 200, status: 'available' },
    { id: '20000000-0000-0000-0000-000000000010', tenant_id: 'a0000000-0000-0000-0000-000000000001', warehouse_id: 'c0000000-0000-0000-0000-000000000001', location_id: 'e0000000-0000-0000-0000-000000000011', product_id: '10000000-0000-0000-0000-000000000010', quantity: 150, quantity_on_hand: 150, quantity_available: 150, status: 'available' },
    { id: '20000000-0000-0000-0000-000000000011', tenant_id: 'a0000000-0000-0000-0000-000000000001', warehouse_id: 'c0000000-0000-0000-0000-000000000001', location_id: 'e0000000-0000-0000-0000-000000000012', product_id: '10000000-0000-0000-0000-000000000011', quantity: 120, quantity_on_hand: 120, quantity_available: 120, status: 'available' },
    { id: '20000000-0000-0000-0000-000000000012', tenant_id: 'a0000000-0000-0000-0000-000000000001', warehouse_id: 'c0000000-0000-0000-0000-000000000001', location_id: 'e0000000-0000-0000-0000-000000000013', product_id: '10000000-0000-0000-0000-000000000012', quantity: 80, quantity_on_hand: 80, quantity_available: 80, status: 'available' },
    { id: '20000000-0000-0000-0000-000000000020', tenant_id: 'a0000000-0000-0000-0000-000000000001', warehouse_id: 'c0000000-0000-0000-0000-000000000001', location_id: 'e0000000-0000-0000-0000-000000000014', product_id: '10000000-0000-0000-0000-000000000020', quantity: 30, quantity_on_hand: 30, quantity_available: 30, status: 'available' },
    { id: '20000000-0000-0000-0000-000000000021', tenant_id: 'a0000000-0000-0000-0000-000000000001', warehouse_id: 'c0000000-0000-0000-0000-000000000001', location_id: 'e0000000-0000-0000-0000-000000000015', product_id: '10000000-0000-0000-0000-000000000021', quantity: 200, quantity_on_hand: 200, quantity_available: 200, status: 'available' }
  ]);

  // 9. Inbound orders
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfter = new Date(Date.now() + 172800000).toISOString().split('T')[0];

  await insertData('inbound_orders', [
    { id: '30000000-0000-0000-0000-000000000001', tenant_id: 'a0000000-0000-0000-0000-000000000001', warehouse_id: 'c0000000-0000-0000-0000-000000000001', customer_id: 'f0000000-0000-0000-0000-000000000001', order_number: 'ASN-2024-0001', supplier_name: 'TechStore Supplier', status: 'pending', priority: 'normal', expected_date: dayAfter, created_by: 'b0000000-0000-0000-0000-000000000002' },
    { id: '30000000-0000-0000-0000-000000000002', tenant_id: 'a0000000-0000-0000-0000-000000000001', warehouse_id: 'c0000000-0000-0000-0000-000000000001', customer_id: 'f0000000-0000-0000-0000-000000000002', order_number: 'ASN-2024-0002', supplier_name: 'Fashion Factory', status: 'confirmed', priority: 'high', expected_date: tomorrow, created_by: 'b0000000-0000-0000-0000-000000000002' },
    { id: '30000000-0000-0000-0000-000000000003', tenant_id: 'a0000000-0000-0000-0000-000000000001', warehouse_id: 'c0000000-0000-0000-0000-000000000001', customer_id: 'f0000000-0000-0000-0000-000000000003', order_number: 'ASN-2024-0003', supplier_name: 'Home Goods Import', status: 'receiving', priority: 'normal', expected_date: today, created_by: 'b0000000-0000-0000-0000-000000000002' }
  ]);

  await insertData('inbound_order_lines', [
    { id: '31000000-0000-0000-0000-000000000001', inbound_order_id: '30000000-0000-0000-0000-000000000001', order_id: '30000000-0000-0000-0000-000000000001', product_id: '10000000-0000-0000-0000-000000000001', line_number: 1, expected_quantity: 50, received_quantity: 0 },
    { id: '31000000-0000-0000-0000-000000000002', inbound_order_id: '30000000-0000-0000-0000-000000000001', order_id: '30000000-0000-0000-0000-000000000001', product_id: '10000000-0000-0000-0000-000000000002', line_number: 2, expected_quantity: 200, received_quantity: 0 },
    { id: '31000000-0000-0000-0000-000000000010', inbound_order_id: '30000000-0000-0000-0000-000000000002', order_id: '30000000-0000-0000-0000-000000000002', product_id: '10000000-0000-0000-0000-000000000010', line_number: 1, expected_quantity: 300, received_quantity: 0 },
    { id: '31000000-0000-0000-0000-000000000011', inbound_order_id: '30000000-0000-0000-0000-000000000002', order_id: '30000000-0000-0000-0000-000000000002', product_id: '10000000-0000-0000-0000-000000000012', line_number: 2, expected_quantity: 100, received_quantity: 0 },
    { id: '31000000-0000-0000-0000-000000000020', inbound_order_id: '30000000-0000-0000-0000-000000000003', order_id: '30000000-0000-0000-0000-000000000003', product_id: '10000000-0000-0000-0000-000000000020', line_number: 1, expected_quantity: 50, received_quantity: 30 },
    { id: '31000000-0000-0000-0000-000000000021', inbound_order_id: '30000000-0000-0000-0000-000000000003', order_id: '30000000-0000-0000-0000-000000000003', product_id: '10000000-0000-0000-0000-000000000021', line_number: 2, expected_quantity: 100, received_quantity: 100 }
  ]);

  // 10. Outbound orders
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  await insertData('outbound_orders', [
    { id: '40000000-0000-0000-0000-000000000001', tenant_id: 'a0000000-0000-0000-0000-000000000001', warehouse_id: 'c0000000-0000-0000-0000-000000000001', customer_id: 'f0000000-0000-0000-0000-000000000001', order_number: 'SO-2024-0001', status: 'allocated', priority: 'high', required_date: today, ship_to_address: { street: 'Klantenstraat 10', city: 'Den Haag', postal_code: '2511 AB', country: 'NL' }, created_by: 'b0000000-0000-0000-0000-000000000002' },
    { id: '40000000-0000-0000-0000-000000000002', tenant_id: 'a0000000-0000-0000-0000-000000000001', warehouse_id: 'c0000000-0000-0000-0000-000000000001', customer_id: 'f0000000-0000-0000-0000-000000000001', order_number: 'SO-2024-0002', status: 'picking', priority: 'normal', required_date: tomorrow, ship_to_address: { street: 'Bezorgweg 55', city: 'Eindhoven', postal_code: '5611 AA', country: 'NL' }, created_by: 'b0000000-0000-0000-0000-000000000002' },
    { id: '40000000-0000-0000-0000-000000000003', tenant_id: 'a0000000-0000-0000-0000-000000000001', warehouse_id: 'c0000000-0000-0000-0000-000000000001', customer_id: 'f0000000-0000-0000-0000-000000000002', order_number: 'SO-2024-0003', status: 'pending', priority: 'normal', required_date: dayAfter, ship_to_address: { street: 'Modewijk 12', city: 'Groningen', postal_code: '9711 JB', country: 'NL' }, created_by: 'b0000000-0000-0000-0000-000000000002' },
    { id: '40000000-0000-0000-0000-000000000004', tenant_id: 'a0000000-0000-0000-0000-000000000001', warehouse_id: 'c0000000-0000-0000-0000-000000000001', customer_id: 'f0000000-0000-0000-0000-000000000003', order_number: 'SO-2024-0004', status: 'shipped', priority: 'low', required_date: yesterday, ship_to_address: { street: 'Thuisbezorgd 8', city: 'Maastricht', postal_code: '6211 CK', country: 'NL' }, created_by: 'b0000000-0000-0000-0000-000000000002' }
  ]);

  await insertData('outbound_order_lines', [
    { id: '41000000-0000-0000-0000-000000000001', outbound_order_id: '40000000-0000-0000-0000-000000000001', order_id: '40000000-0000-0000-0000-000000000001', product_id: '10000000-0000-0000-0000-000000000001', line_number: 1, ordered_quantity: 5, allocated_quantity: 5, picked_quantity: 0, shipped_quantity: 0 },
    { id: '41000000-0000-0000-0000-000000000002', outbound_order_id: '40000000-0000-0000-0000-000000000001', order_id: '40000000-0000-0000-0000-000000000001', product_id: '10000000-0000-0000-0000-000000000002', line_number: 2, ordered_quantity: 10, allocated_quantity: 10, picked_quantity: 0, shipped_quantity: 0 },
    { id: '41000000-0000-0000-0000-000000000010', outbound_order_id: '40000000-0000-0000-0000-000000000002', order_id: '40000000-0000-0000-0000-000000000002', product_id: '10000000-0000-0000-0000-000000000003', line_number: 1, ordered_quantity: 3, allocated_quantity: 3, picked_quantity: 1, shipped_quantity: 0 },
    { id: '41000000-0000-0000-0000-000000000011', outbound_order_id: '40000000-0000-0000-0000-000000000002', order_id: '40000000-0000-0000-0000-000000000002', product_id: '10000000-0000-0000-0000-000000000004', line_number: 2, ordered_quantity: 3, allocated_quantity: 3, picked_quantity: 3, shipped_quantity: 0 },
    { id: '41000000-0000-0000-0000-000000000020', outbound_order_id: '40000000-0000-0000-0000-000000000003', order_id: '40000000-0000-0000-0000-000000000003', product_id: '10000000-0000-0000-0000-000000000010', line_number: 1, ordered_quantity: 20, allocated_quantity: 0, picked_quantity: 0, shipped_quantity: 0 },
    { id: '41000000-0000-0000-0000-000000000021', outbound_order_id: '40000000-0000-0000-0000-000000000003', order_id: '40000000-0000-0000-0000-000000000003', product_id: '10000000-0000-0000-0000-000000000011', line_number: 2, ordered_quantity: 15, allocated_quantity: 0, picked_quantity: 0, shipped_quantity: 0 },
    { id: '41000000-0000-0000-0000-000000000030', outbound_order_id: '40000000-0000-0000-0000-000000000004', order_id: '40000000-0000-0000-0000-000000000004', product_id: '10000000-0000-0000-0000-000000000020', line_number: 1, ordered_quantity: 2, allocated_quantity: 2, picked_quantity: 2, shipped_quantity: 2 },
    { id: '41000000-0000-0000-0000-000000000031', outbound_order_id: '40000000-0000-0000-0000-000000000004', order_id: '40000000-0000-0000-0000-000000000004', product_id: '10000000-0000-0000-0000-000000000021', line_number: 2, ordered_quantity: 10, allocated_quantity: 10, picked_quantity: 10, shipped_quantity: 10 }
  ]);

  // 11. Pick tasks
  await insertData('pick_tasks', [
    { id: '50000000-0000-0000-0000-000000000001', tenant_id: 'a0000000-0000-0000-0000-000000000001', warehouse_id: 'c0000000-0000-0000-0000-000000000001', order_id: '40000000-0000-0000-0000-000000000002', order_line_id: '41000000-0000-0000-0000-000000000010', from_location_id: 'e0000000-0000-0000-0000-000000000022', product_id: '10000000-0000-0000-0000-000000000003', quantity: 3, picked_quantity: 1, status: 'in_progress', priority: 'normal', assigned_to: 'b0000000-0000-0000-0000-000000000003' },
    { id: '50000000-0000-0000-0000-000000000002', tenant_id: 'a0000000-0000-0000-0000-000000000001', warehouse_id: 'c0000000-0000-0000-0000-000000000001', order_id: '40000000-0000-0000-0000-000000000002', order_line_id: '41000000-0000-0000-0000-000000000011', from_location_id: 'e0000000-0000-0000-0000-000000000010', product_id: '10000000-0000-0000-0000-000000000004', quantity: 3, picked_quantity: 3, status: 'completed', priority: 'normal', assigned_to: 'b0000000-0000-0000-0000-000000000003' }
  ]);

  // 12. Billing contracts
  await insertData('billing_contracts', [
    { id: '60000000-0000-0000-0000-000000000001', tenant_id: 'a0000000-0000-0000-0000-000000000001', customer_id: 'f0000000-0000-0000-0000-000000000001', contract_number: 'CONTRACT-001', name: 'TechStore Storage Agreement', start_date: '2024-01-01', end_date: '2024-12-31', billing_cycle: 'monthly', rates: [{ type: 'storage', unit: 'pallet', rate: 25.00 }, { type: 'handling_in', unit: 'pallet', rate: 8.50 }, { type: 'handling_out', unit: 'order', rate: 3.50 }], is_active: true },
    { id: '60000000-0000-0000-0000-000000000002', tenant_id: 'a0000000-0000-0000-0000-000000000001', customer_id: 'f0000000-0000-0000-0000-000000000002', contract_number: 'CONTRACT-002', name: 'Fashion Forward Fulfillment', start_date: '2024-01-01', end_date: '2025-06-30', billing_cycle: 'monthly', rates: [{ type: 'storage', unit: 'pallet', rate: 22.00 }, { type: 'pick', unit: 'line', rate: 0.75 }, { type: 'pack', unit: 'order', rate: 2.00 }], is_active: true }
  ]);

  // 13. Invoices
  await insertData('invoices', [
    { id: '70000000-0000-0000-0000-000000000001', tenant_id: 'a0000000-0000-0000-0000-000000000001', customer_id: 'f0000000-0000-0000-0000-000000000001', contract_id: '60000000-0000-0000-0000-000000000001', invoice_number: 'INV-2024-0001', status: 'paid', period_start: '2024-01-01', period_end: '2024-01-31', subtotal: 1250.00, tax_amount: 262.50, total_amount: 1512.50, due_date: '2024-02-15' },
    { id: '70000000-0000-0000-0000-000000000002', tenant_id: 'a0000000-0000-0000-0000-000000000001', customer_id: 'f0000000-0000-0000-0000-000000000001', contract_id: '60000000-0000-0000-0000-000000000001', invoice_number: 'INV-2024-0002', status: 'sent', period_start: '2024-02-01', period_end: '2024-02-29', subtotal: 1380.00, tax_amount: 289.80, total_amount: 1669.80, due_date: '2024-03-15' },
    { id: '70000000-0000-0000-0000-000000000003', tenant_id: 'a0000000-0000-0000-0000-000000000001', customer_id: 'f0000000-0000-0000-0000-000000000002', contract_id: '60000000-0000-0000-0000-000000000002', invoice_number: 'INV-2024-0003', status: 'draft', period_start: '2024-02-01', period_end: '2024-02-29', subtotal: 890.00, tax_amount: 186.90, total_amount: 1076.90, due_date: '2024-03-15' }
  ]);

  console.log('\nSeed data insertion completed!');
}

runSeed().catch(console.error);
