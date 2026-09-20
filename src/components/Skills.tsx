'use client';

import { motion } from 'framer-motion';
import { skillContainerVariants, skillItemVariants } from '@/animations/profileAnimations';

interface SkillsProps {
  skills: string[];
}

export default function Skills({ skills }: SkillsProps) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="pt-2">
      <h2 className="text-[11px] font-mono uppercase tracking-widest text-[#55585F] mb-2.5">
        Skills &amp; Technologies
      </h2>

      <motion.div
        variants={skillContainerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-1.5"
      >
        {skills.map((skill, idx) => (
          <motion.span
            key={idx}
            variants={skillItemVariants}
            className="px-2.5 py-1 bg-[#111214] rounded-md text-xs font-sans text-[#8B8D93] hover:text-[#F2F2F2] transition-colors cursor-default select-none"
          >
            {skill}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
