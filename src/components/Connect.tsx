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
      'EMAIL;TYPE=INTERNET,HOME:sajal@devdex.dev',
      'URL:https://devdex.dev/sajal',
      'END:VCARD',
    ].join('\r\n');

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sajal-malhotra.vcf';
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
      className="pt-3 border-t border-white/[0.04] space-y-3"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-mono uppercase tracking-widest text-[#55585F]">
          Connect
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleSaveContact}
            className="text-[11px] font-mono text-[#8B8D93] hover:text-[#F2F2F2] transition-colors cursor-pointer px-2 py-0.5"
          >
            .vcf
          </button>
          <span className="text-[#55585F]">·</span>
          <button
            type="button"
            onClick={handleShare}
            className="text-[11px] font-mono text-[#8B8D93] hover:text-[#F2F2F2] transition-colors cursor-pointer px-2 py-0.5"
          >
            {copied ? 'copied!' : 'share'}
          </button>
        </div>
      </div>

      {/* Clean inline link row */}
      <div className="flex items-center gap-4 text-xs font-sans">
        {links.github && (
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8B8D93] hover:text-[#F2F2F2] transition-colors flex items-center gap-1"
          >
            <span>GitHub</span>
            <span className="text-[10px] text-[#55585F]">↗</span>
          </a>
        )}
        {links.linkedin && (
          <a
            href={links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8B8D93] hover:text-[#F2F2F2] transition-colors flex items-center gap-1"
          >
            <span>LinkedIn</span>
            <span className="text-[10px] text-[#55585F]">↗</span>
          </a>
        )}
        {links.x && (
          <a
            href={links.x}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8B8D93] hover:text-[#F2F2F2] transition-colors flex items-center gap-1"
          >
            <span>X</span>
            <span className="text-[10px] text-[#55585F]">↗</span>
          </a>
        )}
        {links.email && (
          <a
            href={`mailto:${links.email}`}
            className="text-[#8B8D93] hover:text-[#F2F2F2] transition-colors flex items-center gap-1"
          >
            <span>Email</span>
            <span className="text-[10px] text-[#55585F]">↗</span>
          </a>
        )}
      </div>
    </motion.section>
  );
}
