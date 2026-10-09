'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import type { Database } from '@/lib/supabase/database.types';
import type { Education, Experience, Project } from '@/types/profile';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type ProfileRow = Database['public']['Tables']['developer_profiles']['Row'];

interface ProfileForm {
  username: string;
  name: string;
  role: string;
  location: string;
  bio: string;
  phone: string;
  email: string;
  website: string;
  github: string;
  linkedin: string;
  x: string;
  availability: string;
  skills: string;
  projects: Project[];
  experience: Experience[];
  education: Education[];
  is_published: boolean;
}

interface ProfileEditorProps {
  userId: string;
  accountName: string;
  accountEmail: string;
  profileOrigin: string;
  initialProfile: ProfileRow | null;
}

const inputClass =
  'mt-2 w-full rounded-lg border border-white/10 bg-[#0b0b0b] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-[#e85d4a]/70';
const emptyProject: Project = { name: '', description: '', technologies: [], github: '', liveDemo: '' };
const emptyExperience: Experience = {
  company: '', role: '', location: '', startDate: '', endDate: '', description: '',
};
const emptyEducation: Education = {
  institution: '', degree: '', field: '', startDate: '', endDate: '', description: '',
};

function createInitialForm({ initialProfile, accountName, accountEmail }: ProfileEditorProps): ProfileForm {
  return {
    username: initialProfile?.username ?? accountEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 30),
    name: initialProfile?.name ?? accountName,
    role: initialProfile?.role ?? '',
    location: initialProfile?.location ?? '',
    bio: initialProfile?.bio ?? '',
    phone: initialProfile?.phone ?? '',
    email: initialProfile?.email ?? accountEmail,
    website: initialProfile?.website ?? '',
    github: initialProfile?.github ?? '',
    linkedin: initialProfile?.linkedin ?? '',
    x: initialProfile?.x ?? '',
    availability: initialProfile?.availability ?? '',
    skills: initialProfile?.skills.join(', ') ?? '',
    projects: initialProfile?.projects ?? [],
    experience: initialProfile?.experience ?? [],
    education: initialProfile?.education ?? [],
    is_published: initialProfile?.is_published ?? true,
  };
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <label className="block text-xs font-medium text-gray-300">
      {label}
      <input
        className={inputClass}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <label className="block text-xs font-medium text-gray-300">
      {label}
      <textarea
        className={`${inputClass} resize-y`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        maxLength={2000}
      />
    </label>
  );
}

function Section({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 sm:p-7">
      <div className="mb-6 flex gap-4">
        <span className="font-mono text-xs text-[#e85d4a]">{number}</span>
        <div>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-gray-500">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function ProfileEditor(props: ProfileEditorProps) {
  const router = useRouter();
  const [form, setForm] = useState(() => createInitialForm(props));
  const [technologyInputs, setTechnologyInputs] = useState(() =>
    (props.initialProfile?.projects ?? []).map((project) => project.technologies.join(', ')),
  );
  const [savedUrl, setSavedUrl] = useState(
    props.initialProfile?.is_published
      ? `${props.profileOrigin}/developers/${props.initialProfile.username}`
      : '',
  );
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  function updateField<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateArray<K extends 'projects' | 'experience' | 'education'>(
    key: K,
    index: number,
    field: keyof ProfileForm[K][number],
    value: string,
  ) {
    setForm((current) => {
      const items = [...current[key]];
      const item = { ...items[index] };
      Object.assign(item, { [field]: value });
      items[index] = item;
      return { ...current, [key]: items };
    });
  }

  function removeArrayItem(key: 'projects' | 'experience' | 'education', index: number) {
    setForm((current) => ({ ...current, [key]: current[key].filter((_, itemIndex) => itemIndex !== index) }));
    if (key === 'projects') {
      setTechnologyInputs((current) => current.filter((_, itemIndex) => itemIndex !== index));
    }
  }

  function addProject() {
    updateField('projects', [...form.projects, { ...emptyProject }]);
    setTechnologyInputs((current) => [...current, '']);
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('');
    setError('');

    const username = form.username.trim().toLowerCase();
    if (!/^[a-z0-9][a-z0-9-]{2,29}$/.test(username)) {
      setError('Choose a username with 3–30 lowercase letters, numbers, or hyphens. It must start with a letter or number.');
      return;
    }
    if (!form.name.trim()) {
      setError('Enter your name to create your public portfolio.');
      return;
    }
    if (!form.phone.trim()) {
      setError('Add a mobile number so visitors can save your contact card.');
      return;
    }

    setIsSaving(true);
    const supabase = createSupabaseBrowserClient();
    const profile = {
      id: props.userId,
      username,
      name: form.name.trim(),
      role: form.role.trim(),
      location: form.location.trim(),
      bio: form.bio.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      website: form.website.trim(),
      github: form.github.trim(),
      linkedin: form.linkedin.trim(),
      x: form.x.trim(),
      availability: form.availability.trim(),
      skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
      projects: form.projects
        .map((project, index) => ({
          ...project,
          technologies: (technologyInputs[index] ?? project.technologies.join(', '))
            .split(',')
            .map((technology) => technology.trim())
            .filter(Boolean),
        }))
        .filter((project) => project.name.trim()),
      experience: form.experience.filter((entry) => entry.company.trim() || entry.role.trim()),
      education: form.education.filter((entry) => entry.institution.trim() || entry.degree.trim()),
      is_published: form.is_published,
    };

    try {
      const { error: saveError } = await supabase
        .from('developer_profiles')
        .upsert(profile, { onConflict: 'id' });
      if (saveError) {
        if (saveError.code === '23505') {
          throw new Error('That profile link is already taken. Choose a different username.');
        }
        throw new Error(`Unable to save your profile: ${saveError.message}`);
      }

      setForm((current) => ({ ...current, username }));
      setSavedUrl(form.is_published ? `${window.location.origin}/developers/${username}` : '');
      setStatus(form.is_published ? 'Profile saved and published.' : 'Profile saved. It is currently private.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save your profile.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSignOut() {
    setError('');
    setIsSigningOut(true);
    const { error: signOutError } = await createSupabaseBrowserClient().auth.signOut();
    if (signOutError) {
      setError(`Unable to sign out: ${signOutError.message}`);
      setIsSigningOut(false);
      return;
    }
    router.replace('/');
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-9 flex items-center justify-between gap-4">
          <Link href="/" className="font-mono text-xs tracking-[0.22em] text-gray-400 transition hover:text-white">
            DEVDEX
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-gray-600 sm:block">{props.accountEmail}</span>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="text-xs text-gray-400 transition hover:text-white disabled:opacity-50"
            >
              {isSigningOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </header>

        <div className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#e85d4a]">Developer dashboard</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Build your DevDex</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
            Add your details once. Share your portfolio with a personal link or QR code, and let people save your contact.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <Section number="01" title="Your identity" description="Set your public profile name and the link people will use to find you.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" value={form.name} onChange={(value) => updateField('name', value)} required maxLength={100} />
              <Field
                label="Profile link / username"
                value={form.username}
                onChange={(value) => {
                  updateField('username', value);
                  setSavedUrl('');
                }}
                placeholder="jane-doe"
                required
                maxLength={30}
              />
              <Field label="Professional title" value={form.role} onChange={(value) => updateField('role', value)} placeholder="Full-stack developer" maxLength={120} />
              <Field label="Location" value={form.location} onChange={(value) => updateField('location', value)} placeholder="City, country" maxLength={120} />
            </div>
            <div className="mt-5">
              <TextArea label="About you" value={form.bio} onChange={(value) => updateField('bio', value)} placeholder="A short introduction and what you enjoy building…" required />
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Skills (comma separated)" value={form.skills} onChange={(value) => updateField('skills', value)} placeholder="TypeScript, React, Node.js" />
              <Field label="Availability" value={form.availability} onChange={(value) => updateField('availability', value)} placeholder="Open to opportunities" maxLength={120} />
            </div>
          </Section>

          <Section number="02" title="Projects" description="Showcase the projects you want visitors to discover.">
            <div className="space-y-4">
              {form.projects.map((project, index) => (
                <div key={index} className="rounded-xl border border-white/[0.07] bg-black/20 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xs font-medium text-gray-300">Project {index + 1}</h3>
                    <button type="button" onClick={() => removeArrayItem('projects', index)} className="text-xs text-gray-600 transition hover:text-red-400">Remove</button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Project name" value={project.name} onChange={(value) => updateArray('projects', index, 'name', value)} required maxLength={120} />
                    <Field label="Technologies (comma separated)" value={technologyInputs[index] ?? project.technologies.join(', ')} onChange={(value) => setTechnologyInputs((current) => current.map((input, itemIndex) => itemIndex === index ? value : input))} placeholder="Next.js, Meta Llama 3.1, Supabase" />
                    <Field label="Repository URL" value={project.github ?? ''} onChange={(value) => updateArray('projects', index, 'github', value)} type="url" placeholder="https://github.com/…" />
                    <Field label="Live project URL" value={project.liveDemo ?? ''} onChange={(value) => updateArray('projects', index, 'liveDemo', value)} type="url" placeholder="https://…" />
                    <div className="sm:col-span-2">
                      <TextArea label="What does it do?" value={project.description} onChange={(value) => updateArray('projects', index, 'description', value)} rows={2} />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addProject} className="rounded-lg border border-white/10 px-4 py-2.5 text-xs text-gray-300 transition hover:border-white/20 hover:text-white">+ Add project</button>
            </div>
          </Section>

          <Section number="03" title="Experience" description="Add current and previous roles, internships, or freelance work.">
            <div className="space-y-4">
              {form.experience.map((entry, index) => (
                <div key={index} className="rounded-xl border border-white/[0.07] bg-black/20 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xs font-medium text-gray-300">Role {index + 1}</h3>
                    <button type="button" onClick={() => removeArrayItem('experience', index)} className="text-xs text-gray-600 transition hover:text-red-400">Remove</button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Job title" value={entry.role} onChange={(value) => updateArray('experience', index, 'role', value)} required maxLength={120} />
                    <Field label="Company" value={entry.company} onChange={(value) => updateArray('experience', index, 'company', value)} required maxLength={120} />
                    <Field label="Location" value={entry.location} onChange={(value) => updateArray('experience', index, 'location', value)} maxLength={120} />
                    <Field label="Start date" value={entry.startDate} onChange={(value) => updateArray('experience', index, 'startDate', value)} type="month" />
                    <Field label="End date (leave blank if current)" value={entry.endDate} onChange={(value) => updateArray('experience', index, 'endDate', value)} type="month" />
                    <div className="sm:col-span-2">
                      <TextArea label="Highlights" value={entry.description} onChange={(value) => updateArray('experience', index, 'description', value)} rows={2} />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => updateField('experience', [...form.experience, { ...emptyExperience }])} className="rounded-lg border border-white/10 px-4 py-2.5 text-xs text-gray-300 transition hover:border-white/20 hover:text-white">+ Add experience</button>
            </div>
          </Section>

          <Section number="04" title="Education" description="Include degrees, courses, or other relevant education.">
            <div className="space-y-4">
              {form.education.map((entry, index) => (
                <div key={index} className="rounded-xl border border-white/[0.07] bg-black/20 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xs font-medium text-gray-300">Education {index + 1}</h3>
                    <button type="button" onClick={() => removeArrayItem('education', index)} className="text-xs text-gray-600 transition hover:text-red-400">Remove</button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Institution" value={entry.institution} onChange={(value) => updateArray('education', index, 'institution', value)} required maxLength={160} />
                    <Field label="Degree / qualification" value={entry.degree} onChange={(value) => updateArray('education', index, 'degree', value)} required maxLength={160} />
                    <Field label="Field of study" value={entry.field} onChange={(value) => updateArray('education', index, 'field', value)} maxLength={160} />
                    <Field label="Start date" value={entry.startDate} onChange={(value) => updateArray('education', index, 'startDate', value)} type="month" />
                    <Field label="End date" value={entry.endDate} onChange={(value) => updateArray('education', index, 'endDate', value)} type="month" />
                    <div className="sm:col-span-2">
                      <TextArea label="Notes" value={entry.description} onChange={(value) => updateArray('education', index, 'description', value)} rows={2} />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => updateField('education', [...form.education, { ...emptyEducation }])} className="rounded-lg border border-white/10 px-4 py-2.5 text-xs text-gray-300 transition hover:border-white/20 hover:text-white">+ Add education</button>
            </div>
          </Section>

          <Section number="05" title="Contact and visibility" description="These details appear on your public portfolio and in your downloadable contact card.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Mobile number" value={form.phone} onChange={(value) => updateField('phone', value)} type="tel" required maxLength={40} />
              <Field label="Contact email" value={form.email} onChange={(value) => updateField('email', value)} type="email" required maxLength={254} />
              <Field label="Website" value={form.website} onChange={(value) => updateField('website', value)} type="url" placeholder="https://…" />
              <Field label="GitHub profile" value={form.github} onChange={(value) => updateField('github', value)} type="url" placeholder="https://github.com/…" />
              <Field label="LinkedIn profile" value={form.linkedin} onChange={(value) => updateField('linkedin', value)} type="url" placeholder="https://linkedin.com/in/…" />
              <Field label="X profile" value={form.x} onChange={(value) => updateField('x', value)} type="url" placeholder="https://x.com/…" />
            </div>
            <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.08] bg-black/20 p-4">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(event) => updateField('is_published', event.target.checked)}
                className="mt-0.5 accent-[#e85d4a]"
              />
              <span>
                <span className="block text-sm font-medium text-white">Publish my profile</span>
                <span className="mt-1 block text-xs leading-5 text-gray-500">Anyone with your QR code or profile link can view your portfolio and contact details.</span>
              </span>
            </label>
          </Section>

          {error && <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">{error}</p>}
          {status && <p role="status" className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-400">{status}</p>}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-xl bg-[#e85d4a] py-4 text-sm font-semibold tracking-wide text-white transition hover:bg-[#d14e3d] disabled:cursor-wait disabled:opacity-60"
          >
            {isSaving ? 'SAVING YOUR PROFILE…' : 'SAVE AND UPDATE PROFILE'}
          </button>
        </form>

        {savedUrl && (
          <section className="mt-8 rounded-2xl border border-[#e85d4a]/20 bg-[#e85d4a]/[0.04] p-6 sm:p-8">
            <div className="text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#e85d4a]">Your portfolio is live</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Share your DevDex</h2>
              <p className="mt-2 break-all text-sm text-gray-400">{savedUrl}</p>
              <div className="mx-auto mt-6 w-fit rounded-xl bg-white p-3">
                <QRCodeSVG value={savedUrl} size={200} level="H" />
              </div>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(savedUrl);
                      setStatus('Profile link copied.');
                    } catch {
                      setError('Unable to copy the link. Select and copy the URL above.');
                    }
                  }}
                  className="rounded-lg border border-white/10 px-4 py-2.5 text-xs font-medium text-white transition hover:border-white/25"
                >
                  COPY PROFILE LINK
                </button>
                <Link
                  href={`/developers/${encodeURIComponent(form.username)}`}
                  target="_blank"
                  className="rounded-lg border border-white/10 px-4 py-2.5 text-xs font-medium text-white transition hover:border-white/25"
                >
                  OPEN PORTFOLIO
                </Link>
              </div>
              <p className="mt-4 text-xs leading-5 text-gray-600">Download or screenshot this QR code, then share it anywhere. Scanning it opens your public portfolio.</p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
