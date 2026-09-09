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
          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #242424 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          <span className="text-sm font-medium text-gray-300 tracking-wide">
            {initials}
          </span>
        </motion.div>
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-white tracking-[-0.01em] leading-tight">
            {profile.name}
          </h1>
          <p className="text-[13px] text-gray-500 mt-0.5">{profile.role}</p>
        </div>
      </motion.div>

      {/* Location + Availability */}
      <motion.div variants={profileItemVariants} className="flex items-center gap-4 flex-wrap">
        {profile.location && (
          <div className="flex items-center gap-1.5">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-600"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-[11px] text-gray-500">{profile.location}</span>
          </div>
        )}

        {profile.availability && (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
            <span className="text-[11px] text-emerald-500/80">{profile.availability}</span>
          </div>
        )}
      </motion.div>

      {/* Bio */}
      {profile.bio && (
        <motion.div variants={profileItemVariants}>
          <p className="text-[13px] text-gray-500 leading-[1.6] max-w-[280px]">
            {profile.bio}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
