import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (!isSupabaseConfigured() || !code) {
    return NextResponse.redirect(new URL('/login?authError=confirmation', requestUrl.origin));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL('/login?authError=confirmation', requestUrl.origin));
  }

  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
}
