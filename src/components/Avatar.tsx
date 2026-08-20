import React from 'react';
import { BuiltInAvatar } from '../types';

interface AvatarProps {
  type?: BuiltInAvatar | string;
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  border?: boolean;
}

const AVATAR_MAP: Record<string, { bg: string; icon: string; label: string }> = {
  fox: { bg: 'bg-[#FF5500]/15 text-[#FF5500]', icon: '🦊', label: 'Fox Avatar' },
  cat: { bg: 'bg-amber-500/15 text-amber-400', icon: '🐱', label: 'Cat Avatar' },
  panda: { bg: 'bg-emerald-500/15 text-emerald-400', icon: '🐼', label: 'Panda Avatar' },
  bear: { bg: 'bg-stone-500/15 text-stone-300', icon: '🐻', label: 'Bear Avatar' },
  rabbit: { bg: 'bg-pink-500/15 text-pink-400', icon: '🐰', label: 'Rabbit Avatar' },
  penguin: { bg: 'bg-cyan-500/15 text-cyan-400', icon: '🐧', label: 'Penguin Avatar' },
  hamster: { bg: 'bg-yellow-500/15 text-yellow-400', icon: '🐹', label: 'Hamster Avatar' },
};

const SIZES = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-xl',
  xl: 'w-16 h-16 text-2xl',
  '2xl': 'w-20 h-20 text-3xl',
};

export const Avatar: React.FC<AvatarProps> = ({
  type = 'fox',
  src,
  alt = 'User Avatar',
  size = 'md',
  className = '',
  border = true,
}) => {
  const sizeClass = SIZES[size] || SIZES.md;
  const borderClass = border ? 'border border-[#272727]' : '';

  if (src && src.startsWith('http')) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeClass} rounded-full object-cover ${borderClass} ${className}`}
      />
    );
  }

  const avatarKey = type && AVATAR_MAP[type.toLowerCase()] ? type.toLowerCase() : 'fox';
  const config = AVATAR_MAP[avatarKey] || AVATAR_MAP.fox;

  return (
    <div
      className={`${sizeClass} rounded-full ${config.bg} flex items-center justify-center font-medium select-none ${borderClass} ${className}`}
      title={config.label}
    >
      <span>{config.icon}</span>
    </div>
  );
};
