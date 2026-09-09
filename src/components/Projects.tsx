'use client'

import { motion } from 'framer-motion'
import { Project } from '@/types/profile'
import { projectContainerVariants } from '@/animations/profileAnimations'
import ProjectCard from './ProjectCard'

interface ProjectsProps {
  projects: Project[]
}

export default function Projects({ projects }: ProjectsProps) {
  if (!projects || projects.length === 0) return null

  return (
    <div>
      <div className="flex justify-between items-baseline mb-4">
        <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-600">
          Featured Projects
        </h2>
        <a
          href="#"
          className="text-[10px] font-mono text-gray-500 hover:text-white transition"
        >
          View All &rarr;
        </a>
      </div>
      <motion.div
        variants={projectContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-3"
      >
        {projects.map((project, idx) => (
          <ProjectCard key={idx} project={project} />
        ))}
      </motion.div>
    </div>
  )
}
