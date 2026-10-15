import 'server-only';

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSupabaseConfig, isSupabaseConfigured } from '@/lib/supabase/config';

export async function DELETE(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!isSupabaseConfigured() || !serviceRoleKey) {
    return NextResponse.json({ error: 'Account deletion is not configured.' }, { status: 503 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Sign in again to delete your account.' }, { status: 401 });
  }

  const { url } = getSupabaseConfig();
  const adminClient = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);

  if (deleteError) {
    console.error('Unable to delete authenticated Supabase user:', deleteError);
    return NextResponse.json({ error: 'Unable to delete your account. Please try again later.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
