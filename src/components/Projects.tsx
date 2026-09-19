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
    <div>
      <div className="flex justify-between items-baseline mb-3">
        <h2 className="text-xs font-medium text-zinc-300 font-sans">
          Featured Projects
        </h2>
        <span className="text-[11px] text-zinc-500 font-sans">
          {projects.length} projects
        </span>
      </div>
      <motion.div
        variants={projectContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-2.5"
      >
        {projects.map((project, idx) => (
          <ProjectCard key={idx} project={project} />
        ))}
      </motion.div>
    </div>
  );
}
