/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        authority: {
          light: '#3B82F6',
          DEFAULT: '#1E3A8A',
          dark: '#1E293B',
        },
        compliance: {
          DEFAULT: '#0D9488',
        },
        violation: {
          DEFAULT: '#DC2626',
        },
        slatebg: {
          light: '#F8FAFC',
          dark: '#0F172A',
        }
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        apple: ['-apple-system', 'BlinkMacSystemFont', '"SF Arabic"', '"SF Pro Display"', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        '3d-inset': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.06), inset 0 -2px 4px 0 rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
}
