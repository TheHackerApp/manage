import type { ClassValue } from 'clsx';
import clsx from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const COMMON_UNITS = ['small', 'medium', 'large'];

// Extend tailwind merge to support NextUI's custom classes
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      opacity: ['disabled'],
      spacing: ['divider'],
      borderWidth: COMMON_UNITS,
      borderRadius: COMMON_UNITS,
    },
    classGroups: {
      shadow: [{ shadow: COMMON_UNITS }],
      'font-size': [{ text: ['tiny', ...COMMON_UNITS] }],
      'bg-image': ['bg-stripe-gradient'],
    },
  },
});

/**
 * Conditionally join classNames together
 */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(...inputs));
