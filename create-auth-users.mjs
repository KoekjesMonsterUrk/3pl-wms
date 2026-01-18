import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xhrklsducxilrfrgbczp.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhocmtsc2R1Y3hpbHJmcmdiY3pwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODc0NjYzMSwiZXhwIjoyMDg0MzIyNjMxfQ.qx2D9etXR0JZUJvskzq_rQ_FXSY6ZrnukEDPLN0lIEs';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const users = [
  { email: 'admin@demo.com', password: 'Admin123!', name: 'Admin User' },
  { email: 'manager@demo.com', password: 'Admin123!', name: 'Warehouse Manager' },
  { email: 'operator@demo.com', password: 'Admin123!', name: 'Floor Operator' }
];

async function createAuthUsers() {
  console.log('Creating auth users...\n');

  for (const user of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        full_name: user.name
      }
    });

    if (error) {
      console.log(`Error creating ${user.email}: ${error.message}`);
    } else {
      console.log(`Created user: ${user.email}`);
    }
  }

  console.log('\nDone! Users can now login with password: Admin123!');
}

createAuthUsers();
