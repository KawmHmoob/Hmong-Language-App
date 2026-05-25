/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Lora', 'Georgia', 'serif'],
      },
      colors: {
        cream: {
          50: '#FBF6EC',
          100: '#F5EBD9',
          200: '#ECDCC0',
          300: '#E0C8A0',
          400: '#D9B38C',
          500: '#C99A6F',
          600: '#A87A52',
        },
        clay: {
          500: '#B25E3D',
          600: '#9C4F33',
          700: '#7E3F28',
        },
        // Soft dusty red — the warm rose counterpart to seafoam green.
        blush: {
          50:  '#FCEEEB',
          100: '#F8DBD5',
          200: '#B0E0E6',  // main background tone
          300: '#E8A39B',
          400: '#D88278',
          500: '#C26358',
        },
      },
      boxShadow: {
        warm: '0 4px 14px -2px rgba(120, 80, 40, 0.12), 0 2px 4px -2px rgba(120, 80, 40, 0.08)',
        'warm-lg': '0 12px 28px -8px rgba(120, 80, 40, 0.18), 0 4px 8px -4px rgba(120, 80, 40, 0.1)',
      },
    },
  },
  plugins: [],
}
