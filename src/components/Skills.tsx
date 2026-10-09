'use client'

import { motion } from 'framer-motion'
import { skillContainerVariants, skillItemVariants } from '@/animations/profileAnimations'

interface SkillsProps {
  skills: string[]
}

export default function Skills({ skills }: SkillsProps) {
  if (!skills || skills.length === 0) return null

  return (
    <div>
      <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-600 mb-3">
        Skills
      </h2>
      <motion.div
        variants={skillContainerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-2"
      >
        {skills.map((skill, idx) => (
          <motion.span
            key={idx}
            variants={skillItemVariants}
            className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-md text-xs font-mono text-gray-300 tracking-wide hover:border-white/[0.12] hover:-translate-y-[1px] transition-all duration-200"
          >
            {skill}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}
