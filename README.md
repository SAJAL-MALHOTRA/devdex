This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Configure Supabase

DevDex uses Supabase Auth and Postgres for developer accounts and profiles.

1. Create a Supabase project and copy `.env.example` to `.env.local`.
2. Add the project URL and anon key to `.env.local`. Set `NEXT_PUBLIC_SITE_URL`
   to your deployed app URL (for local development, use
   `http://localhost:3000`).
3. Run [`supabase/migrations/20261008000000_create_developer_profiles.sql`](./supabase/migrations/20261008000000_create_developer_profiles.sql)
   in the Supabase SQL Editor.
4. In Supabase Authentication settings, enable email/password sign-in and allow
   `http://localhost:3000/auth/callback` and your deployed
   `<site-url>/auth/callback` as redirect URLs for email confirmation.
5. Run `npm run dev` and create an account at `/login`.

The developer dashboard stores a profile, contact information, skills, projects,
experience, and education. Published profiles are available at
`/developers/<username>`. Saving a profile displays its shareable QR code; the
portfolio's **Save Contact** button opens a vCard file with the developer's
name, mobile number, and any available contact details.

Row-level security restricts profile edits to the signed-in owner. Only
published profiles can be read publicly. Developers can unpublish their profile
from the dashboard.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
