'use client';

import { motion } from 'framer-motion';
import { DeveloperProfile } from '@/types/profile';
import {
  profileContainerVariants,
  profileItemVariants,
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
      className="space-y-3.5"
    >
      {/* Monogram + Name Lockup (Inline, editorial) */}
      <motion.div variants={profileItemVariants} className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#111214] border border-white/[0.08] shadow-sm">
          <span className="text-xs font-semibold text-[#F2F2F2] tracking-wider">
            {initials}
          </span>
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-[#F2F2F2] tracking-tight leading-tight font-sans">
            {profile.name}
          </h1>
          <p className="text-xs font-normal text-[#8B8D93] font-sans">
            {profile.role}
          </p>
        </div>
      </motion.div>

      {/* Location & Availability Status */}
      <motion.div variants={profileItemVariants} className="flex items-center gap-2 text-xs text-[#8B8D93]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#20B486]" />
        <span>{profile.availability}</span>
        <span className="text-[#55585F]">·</span>
        <span>{profile.location}</span>
      </motion.div>

      {/* Editorial Bio */}
      {profile.bio && (
        <motion.div variants={profileItemVariants} className="pt-0.5">
          <p className="text-sm text-[#8B8D93] leading-relaxed font-sans max-w-lg">
            {profile.bio}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
