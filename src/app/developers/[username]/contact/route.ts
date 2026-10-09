import { getDeveloperProfile } from '@/data/profiles';
import { isSupabaseConfigured } from '@/lib/supabase/config';

function escapeVCardValue(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\n|\r/g, '\\n')
    .replace(/([,;])/g, '\\$1')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '');
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  if (!isSupabaseConfigured()) {
    return new Response('Profile service is not configured.', { status: 503 });
  }

  const { username } = await params;
  const profile = await getDeveloperProfile(username);

  if (!profile || !profile.phone) {
    return new Response('Contact not found.', { status: 404 });
  }

  const profileUrl = `${new URL(request.url).origin}/developers/${encodeURIComponent(profile.username)}`;
  const [givenName = '', ...remainingNames] = profile.name.trim().split(/\s+/);
  const familyName = remainingNames.pop() ?? '';
  const additionalNames = remainingNames.join(' ');
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${escapeVCardValue(profile.name)}`,
    `N:${escapeVCardValue(familyName)};${escapeVCardValue(givenName)};${escapeVCardValue(additionalNames)};;`,
    `TEL;TYPE=CELL:${escapeVCardValue(profile.phone)}`,
  ];

  if (profile.links.email) lines.push(`EMAIL;TYPE=INTERNET:${escapeVCardValue(profile.links.email)}`);
  if (profile.role) lines.push(`TITLE:${escapeVCardValue(profile.role)}`);
  if (profile.links.website) lines.push(`URL:${escapeVCardValue(profile.links.website)}`);
  lines.push(`URL:${escapeVCardValue(profileUrl)}`, 'END:VCARD');

  return new Response(`${lines.join('\r\n')}\r\n`, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `inline; filename="${profile.username}.vcf"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
