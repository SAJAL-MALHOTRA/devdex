'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { SocialLinks } from '@/types/profile';
import { connectVariants } from '@/animations/profileAnimations';

interface ConnectProps {
  links: SocialLinks;
}

export default function Connect({ links }: ConnectProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleSaveContact = () => {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Malhotra;Sajal;;;',
      'FN:Sajal Malhotra',
      'ORG:DevDex',
      'TEL;TYPE=CELL,VOICE:+919876543210',
      'EMAIL;TYPE=INTERNET,HOME:malhotrasajal243@gmail.com',
      'URL:https://devdex.dev/sajal',
      'NOTE:DevDex Profile: https://devdex.dev/sajal',
      'END:VCARD',
    ].join('\r\n');

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sajal-malhotra-contact.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.section
      variants={connectVariants}
      initial="hidden"
      animate="visible"
      className="mt-5 pt-4 border-t border-white/[0.06]"
    >
      {/* Social Icons */}
      <div className="flex gap-2 items-center justify-center mb-3">
        {links.github && (
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-zinc-900/60 border border-white/[0.08] hover:border-white/[0.16] flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>
        )}

        {links.linkedin && (
          <a
            href={links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-zinc-900/60 border border-white/[0.08] hover:border-white/[0.16] flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
        )}

        {links.x && (
          <a
            href={links.x}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-zinc-900/60 border border-white/[0.08] hover:border-white/[0.16] flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            aria-label="X"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
              <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
            </svg>
          </a>
        )}

        {links.email && (
          <a
            href={`mailto:${links.email}`}
            className="w-8 h-8 rounded-lg bg-zinc-900/60 border border-white/[0.08] hover:border-white/[0.16] flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            aria-label="Email"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </a>
        )}
      </div>

      {/* Primary CTA */}
      <button
        type="button"
        onClick={handleSaveContact}
        className="w-full py-2 bg-[#e5484d] hover:bg-[#d13d42] text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        Save Contact (.vcf)
      </button>

      {/* Secondary CTA */}
      <button
        type="button"
        onClick={handleShare}
        className="mt-2 w-full py-2 bg-zinc-900/60 border border-white/[0.08] hover:border-white/[0.16] text-zinc-300 hover:text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        {copied ? 'Link Copied to Clipboard!' : 'Share Profile'}
      </button>
    </motion.section>
  );
}
