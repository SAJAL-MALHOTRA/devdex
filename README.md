# DevDex

Developer profile and digital identity platform with client-side vCard export, dynamic QR pairing, and PostgreSQL Row-Level Security.

## Overview

DevDex is a developer identity web application with a hardware-themed interface. It allows developers to maintain structured profiles and share them during in-person events via dynamic QR codes and direct contact downloads.

- **Hardware UI:** Interactive terminal interface built with Tailwind CSS and Framer Motion spring physics.
- **Instant Contact Export:** Generates RFC 6350-compliant vCard (`.vcf`) files directly in the browser for one-click mobile contact integration.
- **Dynamic QR Code Pairing:** Real-time QR generation linking directly to `/developers/[username]`.
- **Database Security:** Hosted on Supabase (PostgreSQL) with strict Row-Level Security (RLS) policies.

---

## Architecture & Security

### Database & Row-Level Security (RLS)

All profile data is stored in PostgreSQL and secured with Supabase Row-Level Security:

```sql
-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Public can view published profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (is_published = true);

-- Users can read their own profile in any state
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Users can only modify their own profile
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile" 
ON profiles FOR DELETE 
USING (auth.uid() = id);
```

Account deletion and administrative operations run through server-side route handlers protected by `SUPABASE_SERVICE_ROLE_KEY`.

---

## Project Structure

```text
src/
├── animations/
│   ├── deviceAnimations.ts      # Chassis entry and transition physics
│   ├── profileAnimations.ts     # Panel stagger and reveal animations
│   └── scannerAnimations.ts     # Scanner overlay sequences
├── app/
│   ├── api/account/route.ts     # Server-side account deletion endpoint
│   ├── auth/callback/route.ts   # PKCE auth code exchange
│   ├── dashboard/page.tsx       # Authenticated profile editor
│   ├── developers/[username]/   # Public developer profile view
│   ├── login/page.tsx           # Authentication view
│   └── page.tsx                 # Landing and profile search
├── components/
│   ├── DevDexDevice.tsx         # Hardware chassis wrapper
│   ├── DevDexAI.tsx             # Interactive assistant terminal
│   ├── ProfileEditor.tsx        # Profile form manager
│   ├── Scanner.tsx              # Scanner visualizer
│   └── LEDIndicator.tsx         # Connection status indicator
└── lib/
    └── supabase/
        ├── client.ts            # Browser Supabase client
        ├── server.ts            # Server-side Supabase client
        └── database.types.ts    # TypeScript database definitions
```

---

## Setup & Local Development

### Prerequisites
- Node.js 18+
- Supabase account

### 1. Install Dependencies
```bash
git clone https://github.com/SAJAL-MALHOTRA/devdex.git
cd devdex
npm install
```

### 2. Configure Environment Variables
Create `.env.local` in the project root:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Run Migrations
Execute the SQL files in `supabase/migrations/` sequentially in your Supabase SQL editor.

### 4. Start Development Server
```bash
npm run dev
```

---

## License

MIT License.
