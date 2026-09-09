'use client';

import DevDexDevice from '@/components/DevDexDevice';
import ParticleField from '@/components/ParticleField';
import { sampleProfile } from '@/data/sampleProfile';

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Ambient particle field */}
      <ParticleField intensity="low" />

      {/* Subtle radial ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(232, 93, 74, 0.03) 0%, transparent 60%)',
        }}
      />

      {/* Device */}
      <div className="relative z-10 w-full max-w-4xl px-4 py-8">
        <DevDexDevice profile={sampleProfile} />
      </div>
    </main>
  );
}
