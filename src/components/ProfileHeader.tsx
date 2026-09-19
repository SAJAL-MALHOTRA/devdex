'use client';

import { motion } from 'framer-motion';
import { DeveloperProfile } from '@/types/profile';
import {
  profileContainerVariants,
  profileItemVariants,
  scaleInVariants,
} from '@/animations/profileAnimations';

interface ProfileHeaderProps {
  profile: DeveloperProfile;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <motion.div
      variants={profileContainerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Avatar + Identity */}
      <motion.div variants={profileItemVariants} className="flex items-center gap-3.5">
        <motion.div
          variants={scaleInVariants}
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-zinc-900 border border-white/[0.08] shadow-sm"
        >
          <span className="text-sm font-medium text-zinc-200">
            {initials}
          </span>
        </motion.div>
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-white tracking-tight leading-tight">
            {profile.name}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">{profile.role}</p>
        </div>
      </motion.div>

      {/* Location + Availability */}
      <motion.div variants={profileItemVariants} className="flex items-center gap-3.5 flex-wrap">
        {profile.location && (
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-zinc-500"
              aria-hidden="true"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{profile.location}</span>
          </div>
        )}

        {profile.availability && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400/90 font-normal">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{profile.availability}</span>
          </div>
        )}
      </motion.div>

      {/* Bio */}
      {profile.bio && (
        <motion.div variants={profileItemVariants}>
          <p className="text-xs text-zinc-300 leading-relaxed max-w-[280px]">
            {profile.bio}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
