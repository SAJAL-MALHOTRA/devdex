'use client';

import { motion } from 'framer-motion';
import { Project } from '@/types/profile';
import { projectCardVariants } from '@/animations/profileAnimations';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      variants={projectCardVariants}
      className="group py-2.5 px-3 -mx-3 rounded-lg hover:bg-white/[0.02] transition-colors duration-150"
    >
      <div className="flex items-baseline justify-between">
        <a
          href={project.liveDemo || project.github || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-[#F2F2F2] group-hover:text-white transition-colors flex items-center gap-1.5"
        >
          <span>{project.name}</span>
          <span className="text-xs text-[#55585F] group-hover:text-[#E5484D] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150">
            ↗
          </span>
        </a>

        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono text-[#55585F] hover:text-[#8B8D93] transition-colors"
          >
            source
          </a>
        )}
      </div>

      <p className="text-xs text-[#8B8D93] mt-1 leading-relaxed font-sans">
        {project.description}
      </p>

      {project.technologies && project.technologies.length > 0 && (
        <p className="text-[11px] font-mono text-[#55585F] mt-1.5">
          {project.technologies.join(' · ')}
        </p>
      )}
    </motion.div>
  );
}
