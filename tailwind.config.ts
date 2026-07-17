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
        'sunset-orange': '#C49A3C',
        'sunset-coral': '#B8860B',
        'sunset-gold': '#D4AF6A',
        'sunset-pink': '#8B6914',
        'sunset-purple': '#3D2B1F',
        'sunset-cream': '#FAF4E6',
        'sunset-dark': '#1B2A4A',
        // Desert palette aliases
        'desert-gold': '#C49A3C',
        'desert-sand': '#D4AF6A',
        'desert-navy': '#1B2A4A',
        'desert-cream': '#FAF4E6',
        'desert-tan': '#C9A96E',
        'desert-dark': '#2C1810',
        'desert-light': '#FDF8EE',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'sunset-gradient': 'linear-gradient(135deg, #1B2A4A 0%, #2C3E6B 30%, #C49A3C 70%, #D4AF6A 100%)',
        'sunset-gradient-r': 'linear-gradient(to right, #1B2A4A, #2C3E6B, #C49A3C, #D4AF6A)',
        'sunset-radial': 'radial-gradient(ellipse at center, #D4AF6A 0%, #C49A3C 40%, #2C3E6B 70%, #1B2A4A 100%)',
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
        'sunset': '0 4px 40px rgba(196, 154, 60, 0.25)',
        'sunset-lg': '0 8px 60px rgba(196, 154, 60, 0.35)',
        'card': '0 2px 30px rgba(27, 42, 74, 0.12)',
        'card-hover': '0 8px 50px rgba(27, 42, 74, 0.22)',
      },
    },
  },
  plugins: [],
}
export default config
