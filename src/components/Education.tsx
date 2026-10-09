import type { Education as EducationItem } from '@/types/profile';

function formatEducationDate(value: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return value;

  const [, year, month] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
  if (date.getUTCMonth() !== Number(month) - 1) return value;

  return new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export default function Education({ entries }: { entries: EducationItem[] }) {
  if (entries.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-600">Education</h2>
      <div className="space-y-3">
        {entries.map((entry, index) => (
          <article key={`${entry.institution}-${index}`} className="rounded-lg border border-white/[0.06] bg-[#141414] p-4">
            <h3 className="text-sm font-medium text-white">{entry.institution}</h3>
            <p className="mt-1 text-xs text-gray-400">
              {[entry.degree, entry.field].filter(Boolean).join(' · ')}
            </p>
            {(entry.startDate || entry.endDate) && (
              <p className="mt-1 font-mono text-[10px] text-gray-600">
                {entry.startDate ? formatEducationDate(entry.startDate) : '—'} – {entry.endDate ? formatEducationDate(entry.endDate) : 'Present'}
              </p>
            )}
            {entry.description && <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-gray-500">{entry.description}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}
