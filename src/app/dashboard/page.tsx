import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { connection } from 'next/server';
import SupabaseSetup from '@/components/SupabaseSetup';
import ProfileEditor from '@/components/ProfileEditor';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  await connection();
  if (!isSupabaseConfigured()) return <SupabaseSetup />;

  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError && userError.name !== 'AuthSessionMissingError') {
    throw new Error(`Unable to verify your sign-in: ${userError.message}`);
  }

  if (!user) redirect('/login');

  const { data: profile, error: profileError } = await supabase
    .from('developer_profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(`Unable to load your profile: ${profileError.message}`);
  }

  const requestHeaders = await headers();
  const host = requestHeaders.get('x-forwarded-host')?.split(',')[0].trim()
    ?? requestHeaders.get('host')
    ?? 'localhost:3000';
  const protocol = requestHeaders.get('x-forwarded-proto')?.split(',')[0].trim()
    ?? (host.startsWith('localhost') ? 'http' : 'https');
  const profileOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? `${protocol}://${host}`;

  return (
    <ProfileEditor
      userId={user.id}
      accountName={String(user.user_metadata.full_name ?? '')}
      accountEmail={user.email ?? ''}
      initialProfile={profile}
      profileOrigin={profileOrigin}
    />
  );
}
