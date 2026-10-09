import type { Experience as ExperienceItem } from '@/types/profile';

export default function Experience({ entries }: { entries: ExperienceItem[] }) {
  if (entries.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-600">Experience</h2>
      <div className="space-y-3">
        {entries.map((entry, index) => (
          <article key={`${entry.company}-${index}`} className="rounded-lg border border-white/[0.06] bg-[#141414] p-4">
            <h3 className="text-sm font-medium text-white">{entry.role}</h3>
            <p className="mt-1 text-xs text-gray-400">
              {entry.company}{entry.location ? ` · ${entry.location}` : ''}
            </p>
            {(entry.startDate || entry.endDate) && (
              <p className="mt-1 font-mono text-[10px] text-gray-600">
                {entry.startDate || '—'} – {entry.endDate || 'Present'}
              </p>
            )}
            {entry.description && <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-gray-500">{entry.description}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}
