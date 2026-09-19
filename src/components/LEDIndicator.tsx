'use client';

import React from 'react';

export interface LEDIndicatorProps {
  color?: 'red' | 'green' | 'cyan' | 'neutral';
  active?: boolean;
  size?: number;
}

const colorValues = {
  red: '#e5484d',
  green: '#10b981',
  cyan: '#e5484d',
  neutral: '#71717a',
};

export default function LEDIndicator({
  color = 'red',
  active = true,
  size = 3,
}: LEDIndicatorProps) {
  const hexColor = colorValues[color];

  return (
    <>
      <style>{`
        @keyframes ledPulse {
          0% { opacity: 0.3; }
          50% { opacity: 0.8; }
          100% { opacity: 0.3; }
        }
      `}</style>
      <div
        style={{
          width: size,
          height: size,
          backgroundColor: hexColor,
          borderRadius: '50%',
          boxShadow: active ? `0 0 4px 1px ${hexColor}40` : 'none',
          animation: active ? 'ledPulse 2s infinite ease-in-out' : 'none',
          opacity: active ? undefined : 0.25,
        }}
      />
    </>
  );
}
