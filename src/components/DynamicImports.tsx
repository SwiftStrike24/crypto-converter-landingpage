import dynamic from 'next/dynamic';
import React from 'react';

/**
 * Dynamic imports for heavy components (2025 optimization)
 * This reduces initial bundle size by lazy-loading components
 * only when they're needed
 */

// Dynamic import for Framer Motion components
export const MotionDiv = dynamic(() => 
  import('framer-motion').then(mod => mod.motion.div), 
  { ssr: false, loading: () => <div /> }
);

export const MotionSection = dynamic(() => 
  import('framer-motion').then(mod => mod.motion.section), 
  { ssr: false, loading: () => <React.Fragment /> }
);

export const MotionSpan = dynamic(() => 
  import('framer-motion').then(mod => mod.motion.span), 
  { ssr: false, loading: () => <span /> }
);

// Dynamic Radix UI components
export const Accordion = {
  Root: dynamic(() => import('@radix-ui/react-accordion').then(mod => mod.Root)),
  Item: dynamic(() => import('@radix-ui/react-accordion').then(mod => mod.Item)),
  Trigger: dynamic(() => import('@radix-ui/react-accordion').then(mod => mod.Trigger)),
  Content: dynamic(() => import('@radix-ui/react-accordion').then(mod => mod.Content)),
};

export const Avatar = {
  Root: dynamic(() => import('@radix-ui/react-avatar').then(mod => mod.Root)),
  Image: dynamic(() => import('@radix-ui/react-avatar').then(mod => mod.Image)),
  Fallback: dynamic(() => import('@radix-ui/react-avatar').then(mod => mod.Fallback)),
};

export const Tooltip = {
  Provider: dynamic(() => import('@radix-ui/react-tooltip').then(mod => mod.Provider)),
  Root: dynamic(() => import('@radix-ui/react-tooltip').then(mod => mod.Root)),
  Trigger: dynamic(() => import('@radix-ui/react-tooltip').then(mod => mod.Trigger)),
  Content: dynamic(() => import('@radix-ui/react-tooltip').then(mod => mod.Content)),
};

// Instead of dynamic icons, we'll create specific icon components as needed
// This avoids the complex typing issues with dynamic imports for Lucide icons 