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
        dark: {
          primary: '#0B0F19',
          secondary: '#121826',
          card: '#182234',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: '#1F2C44',
        },
        accent: {
          amber: '#F5A623',
          amberHover: '#D98E16',
          blue: '#38BDF8',
          blueHover: '#0EA5E9',
        },
        text: {
          main: '#FFFFFF',
          muted: '#A8B3C7',
          dim: '#64748B',
        },
        status: {
          success: '#22C55E',
          error: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(180deg, rgba(11, 15, 25, 0.4) 0%, rgba(11, 15, 25, 0.95) 85%, #0B0F19 100%)',
      },
      boxShadow: {
        'glow-amber': '0 0 25px -5px rgba(245, 166, 35, 0.3)',
        'glow-blue': '0 0 25px -5px rgba(56, 189, 248, 0.3)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
