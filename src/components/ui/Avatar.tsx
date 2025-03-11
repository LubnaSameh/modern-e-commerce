"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt = 'User avatar', 
  size = 'md', 
  className = '' 
}) => {
  const [name, setName] = useState<string>(alt);
  const [imageSrc, setImageSrc] = useState<string | null>(src || null);
  
  // Attempt to get name from localStorage if not provided
  useEffect(() => {
    if ((alt === 'User avatar' || alt === 'User') && typeof window !== 'undefined') {
      const storedName = window.localStorage.getItem('user-name');
      if (storedName) {
        setName(storedName);
      }
    }
  }, [alt]);

  // Size mapping
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  // Generate initials from the name
  const getInitials = () => {
    if (!name || name === 'User avatar' || name === 'User') return '';
    return name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const initials = getInitials();

  // If we have a valid src, render an Image
  if (imageSrc) {
    return (
      <div 
        className={`relative rounded-full overflow-hidden ${sizeClasses[size]} ${className}`}
      >
        <Image 
          src={imageSrc} 
          alt={name} 
          fill 
          className="object-cover"
          sizes={`(max-width: 768px) ${size === 'sm' ? '32px' : size === 'md' ? '40px' : '48px'}`}
        />
      </div>
    );
  }

  // If we have initials, render them
  if (initials) {
    return (
      <div 
        className={`flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-medium ${sizeClasses[size]} ${className}`}
      >
        <span className={`${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}`}>
          {initials}
        </span>
      </div>
    );
  }

  // Fallback to user icon
  return (
    <div 
      className={`flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 ${sizeClasses[size]} ${className}`}
    >
      <User size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />
    </div>
  );
};

export default Avatar; 