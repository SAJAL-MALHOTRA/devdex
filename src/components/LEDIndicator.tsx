'use client';

import React from 'react';

export interface LEDIndicatorProps {
  color?: 'red' | 'green' | 'cyan';
  active?: boolean;
  size?: number;
}

const colorValues = {
  red: '#e85d4a',
  green: '#4ade80',
  cyan: '#4ac8e8',
};

export default function LEDIndicator({
  color = 'red',
  active = true,
  size = 4,
}: LEDIndicatorProps) {
  const hexColor = colorValues[color];

  return (
    <>
      <style>{`
        @keyframes ledPulse {
          0% { opacity: 0.3; }
          50% { opacity: 1.0; }
          100% { opacity: 0.3; }
        }
      `}</style>
      <div
        style={{
          width: size,
          height: size,
          backgroundColor: hexColor,
          borderRadius: '50%',
          boxShadow: active ? `0 0 6px 1px ${hexColor}80` : 'none',
          animation: active ? 'ledPulse 2s infinite ease-in-out' : 'none',
          opacity: active ? undefined : 0.3,
        }}
      />
    </>
  );
}
