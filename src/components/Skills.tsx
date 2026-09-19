'use client';

import { motion } from 'framer-motion';
import { skillContainerVariants, skillItemVariants } from '@/animations/profileAnimations';

interface SkillsProps {
  skills: string[];
}

export default function Skills({ skills }: SkillsProps) {
  if (!skills || skills.length === 0) return null;

  return (
    <div>
      <h2 className="text-xs font-medium text-zinc-300 font-sans mb-2.5">
        Technical Skills
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
            className="px-2.5 py-1 bg-zinc-900/50 border border-white/[0.08] rounded-md text-xs font-sans text-zinc-300 hover:border-white/[0.16] hover:text-white transition-colors"
          >
            {skill}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
