/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#050816',
          900: '#091022',
          850: '#0d1730',
        },
        neon: {
          cyan: '#38f2ff',
          mint: '#7cffcb',
          coral: '#ff7aa2',
          gold: '#ffd36e',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(56, 242, 255, 0.15), 0 0 30px rgba(56, 242, 255, 0.18)',
        card: '0 24px 80px rgba(0, 0, 0, 0.45)',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-8px) scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(56, 242, 255, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(56, 242, 255, 0.4)' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        shimmer: 'shimmer 8s ease infinite',
        pulseGlow: 'pulseGlow 2.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};