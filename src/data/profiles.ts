import type { DeveloperProfile } from '@/types/profile';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function getDeveloperProfile(username: string): Promise<DeveloperProfile | undefined> {
  if (!isSupabaseConfigured()) return undefined;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('developer_profiles')
    .select('*')
    .eq('username', username.toLowerCase())
    .eq('is_published', true)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load developer profile: ${error.message}`);
  }

  if (!data) return undefined;

  return {
    name: data.name,
    username: data.username,
    avatar: '',
    role: data.role,
    location: data.location,
    bio: data.bio,
    skills: data.skills,
    projects: data.projects,
    experience: data.experience,
    education: data.education,
    links: {
      github: data.github || undefined,
      linkedin: data.linkedin || undefined,
      x: data.x || undefined,
      email: data.email || undefined,
      website: data.website || undefined,
    },
    phone: data.phone,
    availability: data.availability,
    aiSummary: data.bio,
  };
}
