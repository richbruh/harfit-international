/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slideFromLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        slideFromTop: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        rollIn: {
          '0%': { 
            transform: 'translateY(-100%) rotateX(90deg)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateY(0) rotateX(0)',
            opacity: '1'
          }
        }
      },
      animation: {
        'slide-from-left': 'slideFromLeft 1.5s ease-in',
        'slide-from-top': 'slideFromTop 1.5s ease-in',
        'roll-in': 'rollIn 1s ease-out'
      }
    },
  },
  plugins: [],
}