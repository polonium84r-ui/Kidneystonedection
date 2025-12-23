/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          primary: '#0284C7', // Sky 600
          secondary: '#059669', // Emerald 600
          accent: '#0EA5E9', // Sky 500
          neutral: '#F1F5F9', // Slate 100
          text: '#334155', // Slate 700
          dark: '#1E293B', // Slate 800
          light: '#FFFFFF',
        }
      },
      backgroundImage: {
        'gradient-medical': 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)',
        'gradient-soft': 'linear-gradient(to bottom, #F8FAFC 0%, #F1F5F9 100%)',
      },
      boxShadow: {
        'clean': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'clean-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}


