'use client'

import { motion } from 'framer-motion'
import { Project } from '@/types/profile'
import { projectCardVariants } from '@/animations/profileAnimations'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      variants={projectCardVariants}
      className="bg-[#141414] border border-white/[0.06] rounded-lg p-4 hover:-translate-y-[2px] hover:border-white/[0.12] hover:shadow-lg hover:shadow-black/20 transition-all duration-200"
    >
      <h3 className="text-sm font-medium text-white">{project.name}</h3>
      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{project.description}</p>
      
      {project.technologies && project.technologies.length > 0 && (
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {project.technologies.map((tech, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono px-2 py-0.5 bg-white/[0.04] rounded text-gray-500"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex gap-3">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500 hover:text-[#e85d4a] transition"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            Code
          </a>
        )}
        {project.liveDemo && (
          <a
            href={project.liveDemo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500 hover:text-[#e85d4a] transition"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Demo
          </a>
        )}
      </div>
    </motion.div>
  )
}
