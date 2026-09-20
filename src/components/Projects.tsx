'use client';

import { motion } from 'framer-motion';
import { Project } from '@/types/profile';
import { projectContainerVariants } from '@/animations/profileAnimations';
import ProjectCard from './ProjectCard';

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="pt-2">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[11px] font-mono uppercase tracking-widest text-[#55585F]">
          Selected Work
        </h2>
        <span className="text-[11px] font-mono text-[#55585F]">
          {projects.length}
        </span>
      </div>

      <motion.div
        variants={projectContainerVariants}
        initial="hidden"
        animate="visible"
        className="divide-y divide-white/[0.04]"
      >
        {projects.map((project, idx) => (
          <ProjectCard key={project.name} project={project} index={idx} />
        ))}
      </motion.div>
    </div>
  );
}
