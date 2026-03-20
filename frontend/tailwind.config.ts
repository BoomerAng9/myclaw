import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#1f2121',
          light: '#2a2c2c',
          dark: '#0d0d0d',
          leather: 'rgba(31, 33, 33, 0.95)',
        },
        gold: {
          emboss: '#d4af37',
          bright: '#f4d03f',
          dim: '#8b7329',
          glow: 'rgba(244, 208, 63, 0.5)',
        },
      },
      fontFamily: {
        doto: ['Doto', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        glass: '20px',
        'glass-heavy': '30px',
      },
      backdropSaturate: {
        glass: '180%',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.37)',
        'glass-inset': 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
        glow: '0 0 20px rgba(244, 208, 63, 0.5)',
        'glow-strong': '0 0 40px rgba(244, 208, 63, 0.7)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { filter: 'drop-shadow(0 0 20px rgba(244, 208, 63, 0.5))' },
          '50%': { filter: 'drop-shadow(0 0 30px rgba(244, 208, 63, 0.8))' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
