import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// GET /api/auth - Get current session/user info
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Missing or invalid authorization header' } },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify the token and get user
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } },
        { status: 401 }
      );
    }

    // Get user profile from users table
    const { data: profile } = await supabase
      .from('users')
      .select(`
        *,
        tenant:tenants(*)
      `)
      .eq('auth_id', user.id)
      .single();

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        profile,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

// POST /api/auth - Sign in
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();
    const { action, email, password, refresh_token } = body;

    if (action === 'signin') {
      if (!email || !password) {
        return NextResponse.json(
          { success: false, error: { code: 'VALIDATION_ERROR', message: 'Email and password are required' } },
          { status: 400 }
        );
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return NextResponse.json(
          { success: false, error: { code: 'AUTH_ERROR', message: error.message } },
          { status: 401 }
        );
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('users')
        .select(`
          *,
          tenant:tenants(*)
        `)
        .eq('auth_id', data.user.id)
        .single();

      // Update last login
      if (profile) {
        await supabase
          .from('users')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', profile.id);
      }

      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: data.user.id,
            email: data.user.email,
            profile,
          },
          session: {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at,
          },
        },
      });
    }

    if (action === 'refresh') {
      if (!refresh_token) {
        return NextResponse.json(
          { success: false, error: { code: 'VALIDATION_ERROR', message: 'Refresh token is required' } },
          { status: 400 }
        );
      }

      const { data, error } = await supabase.auth.refreshSession({ refresh_token });

      if (error) {
        return NextResponse.json(
          { success: false, error: { code: 'AUTH_ERROR', message: error.message } },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          session: {
            access_token: data.session?.access_token,
            refresh_token: data.session?.refresh_token,
            expires_at: data.session?.expires_at,
          },
        },
      });
    }

    if (action === 'signout') {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return NextResponse.json(
          { success: false, error: { code: 'AUTH_ERROR', message: error.message } },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, data: null });
    }

    return NextResponse.json(
      { success: false, error: { code: 'INVALID_ACTION', message: 'Invalid action' } },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
