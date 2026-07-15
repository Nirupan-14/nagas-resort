import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'sunset-orange': '#FF6B35',
        'sunset-coral': '#F7931E',
        'sunset-gold': '#FFC15E',
        'sunset-pink': '#C1447E',
        'sunset-purple': '#6A2C5C',
        'sunset-cream': '#FFF8F0',
        'sunset-dark': '#1A0A12',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'sunset-gradient': 'linear-gradient(135deg, #FF6B35 0%, #F7931E 25%, #FFC15E 50%, #C1447E 75%, #6A2C5C 100%)',
        'sunset-gradient-r': 'linear-gradient(to right, #FF6B35, #F7931E, #FFC15E, #C1447E, #6A2C5C)',
        'sunset-radial': 'radial-gradient(ellipse at center, #FFC15E 0%, #F7931E 40%, #C1447E 70%, #6A2C5C 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'sunset': '0 4px 40px rgba(255, 107, 53, 0.25)',
        'sunset-lg': '0 8px 60px rgba(255, 107, 53, 0.35)',
        'card': '0 2px 30px rgba(106, 44, 92, 0.15)',
        'card-hover': '0 8px 50px rgba(106, 44, 92, 0.25)',
      },
    },
  },
  plugins: [],
}
export default config
