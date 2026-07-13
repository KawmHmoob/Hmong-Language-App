/** @type {import('tailwindcss').Config} */

// Every brand color resolves through a CSS variable (defined in src/index.css),
// so existing classes like `bg-cream-50` / `text-stone-900` automatically remap
// when `.dark` is set on <html>. No `dark:` variants needed in components.
// The `<alpha-value>` slot keeps opacity modifiers (bg-cream-50/80) working.
const v = (name) => `rgb(var(--c-${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Lora', 'Georgia', 'serif'],
      },
      colors: {
        // Warm neutrals — card surfaces, borders, tracks.
        cream: {
          50: v('cream-50'),
          100: v('cream-100'),
          200: v('cream-200'),
          300: v('cream-300'),
          400: v('cream-400'),
          500: v('cream-500'),
          600: v('cream-600'),
        },
        // Terracotta accent — buttons, progress, active states.
        clay: {
          500: v('clay-500'),
          600: v('clay-600'),
          700: v('clay-700'),
        },
        // Soft dusty red — warnings, the rose counterpart to seafoam.
        blush: {
          50: v('blush-50'),
          100: v('blush-100'),
          200: v('blush-200'),
          300: v('blush-300'),
          400: v('blush-400'),
          500: v('blush-500'),
        },
        // Cool blue-green — page background and header/footer bands.
        seafoam: {
          50: v('seafoam-50'),
          100: v('seafoam-100'),
          200: v('seafoam-200'),
          300: v('seafoam-300'),
          400: v('seafoam-400'),
          500: v('seafoam-500'),
        },
        // Text scale. Overrides Tailwind's default `stone` so the scale can
        // INVERT in dark mode (stone-900 = ink: near-black in light, warm
        // white in dark). Components keep saying text-stone-900 everywhere.
        stone: {
          50: v('stone-50'),
          100: v('stone-100'),
          200: v('stone-200'),
          300: v('stone-300'),
          400: v('stone-400'),
          500: v('stone-500'),
          600: v('stone-600'),
          700: v('stone-700'),
          800: v('stone-800'),
          900: v('stone-900'),
        },
      },
      boxShadow: {
        warm: 'var(--shadow-warm)',
        'warm-lg': 'var(--shadow-warm-lg)',
      },
    },
  },
  plugins: [],
}
