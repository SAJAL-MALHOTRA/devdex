<div align="center">

# 📟 DEVDEX

### **Cyber-Hardware Digital Identity & Instant Networking System for Developers**

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_Postgres-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13.0-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

<p align="center">
  <strong>A Pokédex-inspired, tactical hardware identity interface for engineers, hackers, and conference attendees.</strong><br>
  Engineered with retro-futuristic mechanical animations, live system diagnostics, instant vCard compilation, dynamic QR sync, and PostgreSQL Row-Level Security.
</p>

[System Overview](#-system-overview) •
[Key Engineering Highlights](#-key-engineering-highlights) •
[Database & Security Architecture](#-database--security-architecture) •
[Component Architecture](#-component-architecture) •
[Quickstart & Setup](#-quickstart--installation) •
[License](#-license)

</div>

---

## 🎯 System Overview

Traditional developer portfolios are passive, static, and ineffective for fast-paced physical networking at hackathons, conferences, and meetups. 

**DevDex** reimagines developer identity as a physical, cybernetic handheld device (`DevDexDevice`):
1. **Tactile Hardware Experience:** Custom CRT scanlines, responsive LED indicators, ambient particle fields, audio-visual scanner sequences, and physical button feedback driven by `framer-motion`.
2. **Instant Contact Ingestion:** One-click generation of RFC-compliant **vCard (.vcf)** files containing developer contact details, social links, and public profiles for instant phone contacts integration.
3. **Dynamic QR Code Pairing:** Real-time generation of high-contrast QR codes for direct scan-to-profile discovery at `/developers/[username]`.
4. **Autonomous AI Companion:** Embedded **DevDex AI** terminal providing interactive insights into developer competencies, experience logs, and project retrospectives.

---

## ⚡ Key Engineering Highlights

### 1. Cyber-Hardware UI & Kinetic Motion System
- **State-Driven Physical Components:** Integrated components like `LEDIndicator.tsx`, `Scanner.tsx`, and `DevDexDevice.tsx` mimic actual physical electronic equipment with blinking telemetry lights, boot-up diagnostics, and frequency waveform animations.
- **Hardware Simulation:** Uses CSS transforms, radial gradients, and Framer Motion spring physics to simulate realistic mechanical buttons, chassis depth, and CRT glare.

### 2. Multi-Tenant Relational Data Model with Supabase
- **Normalized Schema:** Handles complex relational profiles containing developer metadata, categorized skill tags, project highlights, chronological work experience, and educational background.
- **Atomic Profile Publishing:** Supports draft vs. published profile modes, enabling developers to stage portfolio updates before publicly broadcasting them.

### 3. Contact vCard Generation Pipeline
- Generates RFC 6350-compliant vCards directly on client interaction:
  ```text
  BEGIN:VCARD
  VERSION:3.0
  FN:Developer Name
  TITLE:Software Engineer
  TEL;TYPE=CELL:+1234567890
  URL:https://devdex.dev/developers/username
  END:VCARD
  ```
- Triggers automatic binary blob downloads, allowing mobile recruiters and peers to save contact information into their native phone dialer in under 2 seconds.

---

## 🛡️ Database & Security Architecture

DevDex enforces strict enterprise-grade security using **PostgreSQL Row-Level Security (RLS)** in Supabase:

```sql
-- Enforce Row-Level Security on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 1. Anyone can view published profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (is_published = true);

-- 2. Authenticated users can view their own profile regardless of published status
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- 3. Users can only update their own profile record
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- 4. Users can only delete their own profile record
CREATE POLICY "Users can delete own profile" 
ON profiles FOR DELETE 
USING (auth.uid() = id);
```

- **Service Role Isolation:** Account teardowns and administrative actions run through isolated server-side Next.js route handlers (`/api/account`) protected by `SUPABASE_SERVICE_ROLE_KEY`.

---

## 📁 Component Architecture

```text
src/
├── animations/
│   ├── deviceAnimations.ts      # Hardware chassis entry/exit spring physics
│   ├── profileAnimations.ts     # Data panel slide transitions & stagger sequences
│   └── scannerAnimations.ts     # Laser sweep & holographic frequency loops
├── app/
│   ├── api/account/route.ts     # Privileged server-side account teardown handler
│   ├── auth/callback/route.ts   # PKCE auth code exchange & OAuth session handling
│   ├── dashboard/page.tsx       # Secure authenticated developer profile editor
│   ├── developers/[username]/   # Publicly accessible, responsive DevDex device view
│   ├── login/page.tsx           # Terminal-styled authentication portal
│   └── page.tsx                 # Interactive landing matrix & public search
├── components/
│   ├── DevDexDevice.tsx         # Core hardware chassis & viewport wrapper
│   ├── DevDexAI.tsx             # Interactive assistant & terminal intelligence
│   ├── ProfileEditor.tsx        # Dynamic multi-section profile manager
│   ├── Scanner.tsx              # Optical targeting & discovery visualizer
│   ├── LEDIndicator.tsx         # Real-time connection & power indicator lights
│   └── ParticleField.tsx        # Ambient cybernetic background canvas
└── lib/
    └── supabase/
        ├── client.ts            # Client-side Supabase browser client
        ├── server.ts            # Next.js Server Component / Cookie-based client
        └── database.types.ts    # Auto-generated TypeScript database definitions
```

---

## 🚀 Quickstart & Installation

### Prerequisites
- Node.js 18.x or 20.x
- A free [Supabase](https://supabase.com) account

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/SAJAL-MALHOTRA/devdex.git
cd devdex
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-for-server-endpoints
```

### 3. Run Database Migrations
Execute the SQL migration files located in `supabase/migrations/` sequentially inside your Supabase SQL Editor to initialize tables, indexes, and RLS policies.

### 4. Run Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to launch the DevDex interface.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
