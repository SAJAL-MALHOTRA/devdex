'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { statusTextVariants } from '@/animations/scannerAnimations';

export interface StatusTextProps {
  messages: string[];
  isActive: boolean;
  intervalMs?: number;
}

export default function StatusText({
  messages,
  isActive,
  intervalMs = 2000,
}: StatusTextProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isActive || messages.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isActive, messages.length, intervalMs]);

  if (!messages || messages.length === 0) return null;

  return (
    <div className="relative overflow-hidden h-[14px] flex items-center">
      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            key={index}
            variants={statusTextVariants}
            initial="enter"
            animate="visible"
            exit="exit"
            className="font-mono text-[10px] tracking-[0.2em] uppercase text-gray-500"
          >
            {messages[index]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
