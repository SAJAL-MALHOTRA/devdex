import SupabaseSetup from '@/components/SupabaseSetup';
import AuthForm from '@/components/AuthForm';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { connection } from 'next/server';

export default async function LoginPage() {
  await connection();
  if (!isSupabaseConfigured()) return <SupabaseSetup />;

  return <AuthForm />;
}
