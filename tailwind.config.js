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
          blue: '#3B82F6',
          cyan: '#06B6D4',
          teal: '#14B8A6',
          purple: '#8B5CF6',
          pink: '#EC4899',
        }
      },
      backgroundImage: {
        'gradient-medical': 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 25%, #14B8A6 50%, #8B5CF6 75%, #EC4899 100%)',
        'gradient-medical-soft': 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 50%, #8B5CF6 100%)',
        'gradient-hero': 'linear-gradient(135deg, #667EEA 0%, #764BA2 50%, #F093FB 100%)',
      },
      boxShadow: {
        'medical-glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'medical-glow-strong': '0 0 30px rgba(59, 130, 246, 0.5)',
        'cyan-glow': '0 0 20px rgba(6, 182, 212, 0.3)',
        'purple-glow': '0 0 20px rgba(139, 92, 246, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'rotate-slow': 'rotate 3s linear infinite',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        }
      }
    },
  },
  plugins: [],
}


