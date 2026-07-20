/**
 * JOB Lo Design System Tokens
 * Master configurations for Typography, Colors, Spacing, Radius, Shadow, Animations, and Icons.
 */

export const DESIGN_SYSTEM = {
  // Typography Hierarchy Pairing
  typography: {
    fontSans: '"Inter", ui-sans-serif, system-ui, -apple-system, sans-serif',
    fontHeading: '"Inter", ui-sans-serif, system-ui, sans-serif', // Space Grotesk or Inter
    fontMono: '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
    sizes: {
      '3xs': 'text-[10px] leading-tight font-mono',
      '2xs': 'text-[11px] leading-normal font-sans',
      xs: 'text-xs leading-relaxed font-sans',
      sm: 'text-sm leading-relaxed font-sans',
      base: 'text-base leading-relaxed font-sans',
      lg: 'text-lg font-medium leading-normal',
      xl: 'text-xl font-bold leading-snug',
      '2xl': 'text-2xl font-extrabold leading-tight tracking-tight',
      '3xl': 'text-3xl font-black leading-none tracking-tighter',
    }
  },

  // Color Palette Definitions
  colors: {
    primary: {
      emerald: {
        50: '#ecfdf5',
        100: '#d1fae5',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
        800: '#065f46',
      }
    },
    neutral: {
      white: '#ffffff',
      slate: {
        50: '#f8fafc',
        100: '#f1f5f9',
        150: '#e2e8f0', // Inbetween border mapping
        200: '#cbd5e1',
        500: '#64748b',
        800: '#1e293b',
        900: '#0f172a',
        950: '#020617',
      },
      zinc: {
        900: '#18181b',
        950: '#09090b',
      }
    },
    accent: {
      indigo: {
        50: '#f5f3ff',
        100: '#ede9fe',
        500: '#6366f1',
        950: '#0b0a0f',
      }
    }
  },

  // Responsive Spacing Scale (Tailwind mapping)
  spacing: {
    xs: 'p-3 gap-3',
    sm: 'p-4 gap-4',
    md: 'p-6 sm:p-8 gap-6',
    lg: 'p-8 sm:p-12 gap-8',
    xl: 'p-12 sm:p-16 md:p-20 gap-12',
    layout: {
      container: 'max-w-7xl mx-auto px-6 sm:px-8',
      grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    }
  },

  // Standard Border Radius Bounds
  radius: {
    none: 'rounded-none',
    sm: 'rounded-sm', // 2px
    md: 'rounded-md', // 6px
    lg: 'rounded-lg', // 8px
    xl: 'rounded-xl', // 12px
    '2xl': 'rounded-2xl', // 16px (Cards default)
    full: 'rounded-full', // Circular buttons, avatars
  },

  // Cohesive Shadow System
  shadows: {
    none: 'shadow-none',
    xs: 'shadow-3xs', // 0 1px 2px rgba(0,0,0,0.02)
    sm: 'shadow-xs', // 0 1px 3px rgba(0,0,0,0.05)
    md: 'shadow-md', // 0 4px 6px -1px rgba(0,0,0,0.07)
    lg: 'shadow-lg border border-slate-100', // 0 10px 15px -3px rgba(0,0,0,0.05)
  },

  // Motion Framer Transition Presets
  animation: {
    transitions: {
      default: { duration: 0.18, ease: 'easeInOut' },
      smooth: { duration: 0.22, ease: [0.16, 1, 0.3, 1] }, // Ease out expo
      stagger: 0.05,
    },
    hover: 'hover:scale-[1.01] hover:shadow-md transition-all active:scale-[0.995]',
  }
};
