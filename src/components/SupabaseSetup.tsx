import { supabaseSetupMessage } from '@/lib/supabase/config';

export default function SupabaseSetup() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-5">
      <section className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#111] p-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#e85d4a]">DevDex setup</p>
        <h1 className="mt-4 text-2xl font-semibold text-white">Connect your profile database</h1>
        <p className="mt-3 text-sm leading-6 text-gray-400">
          {supabaseSetupMessage} Then run the SQL migration in your Supabase project and restart the app.
        </p>
        <p className="mt-4 break-all rounded-lg bg-black/40 p-4 font-mono text-xs text-gray-300">
          supabase/migrations/20261008000000_create_developer_profiles.sql
        </p>
      </section>
    </main>
  );
}
