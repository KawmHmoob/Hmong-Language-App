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
        // `display` is the Hmong/heading face; `sans` is everything else.
        // Named `display` (not `serif`) because it ISN'T a serif — a token
        // named for what it isn't is the blush-200 trap all over again.
        sans: ['"Nunito Sans"', 'system-ui', 'sans-serif'],
        display: ['Nunito', '"Nunito Sans"', 'system-ui', 'sans-serif'],
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

        ocean: {
          50:  v('ocean-50'),
          100: v('ocean-100'),
          200: v('ocean-200'),
          300: v('ocean-300'),
          400: v('ocean-400'),
          500: v('ocean-500'),
          600: v('ocean-600'),   // darker
          700: v('ocean-700'),   // much darker
        },
        // Answer feedback. Named for MEANING, not hue, because the hue moves:
        // neon's "success" is electric teal, not green. Like `stone`, these
        // INVERT — 50 is always the surface and 900 is always the text on it,
        // so `bg-success-50 text-success-900` is legible in all three themes.
        // Raw `emerald-50`/`red-50` do NOT theme, and produced near-white text
        // on a near-white chip in dark mode. See notes/55.
        success: {
          50: v('success-50'),
          200: v('success-200'),
          500: v('success-500'),
          700: v('success-700'),
          900: v('success-900'),
        },
        danger: {
          50: v('danger-50'),
          200: v('danger-200'),
          500: v('danger-500'),
          700: v('danger-700'),
          900: v('danger-900'),
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
