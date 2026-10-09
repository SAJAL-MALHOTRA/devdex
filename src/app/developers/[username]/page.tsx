import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DevDexDevice from '@/components/DevDexDevice';
import { getDeveloperProfile } from '@/data/profiles';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import SupabaseSetup from '@/components/SupabaseSetup';

interface DeveloperPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: DeveloperPageProps): Promise<Metadata> {
  const { username } = await params;
  if (!isSupabaseConfigured()) {
    return { title: 'DevDex — Developer Portfolio' };
  }

  const profile = await getDeveloperProfile(username);

  if (!profile) {
    return { title: 'Developer not found — DevDex' };
  }

  return {
    title: `${profile.name} — DevDex`,
    description: profile.bio,
  };
}

export default async function DeveloperPage({ params }: DeveloperPageProps) {
  if (!isSupabaseConfigured()) return <SupabaseSetup />;

  const { username } = await params;
  const profile = await getDeveloperProfile(username);

  if (!profile) {
    notFound();
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      <div className="relative z-10 w-full max-w-4xl px-4 py-8">
        <DevDexDevice profile={profile} startOpen />
      </div>
    </main>
  );
}
