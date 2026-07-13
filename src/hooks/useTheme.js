import { useCallback, useState } from 'react'

// Theme switch — three themes on one token engine (see notes/24 + 25):
//   'light' — the original warm palette (brand default look)
//   'dark'  — warm charcoal (primary/default theme)
//   'neon'  — opt-in vibrant skin: violet surfaces, coral + electric teal
//
// Source of truth is the <html> element, set before React mounts by the
// inline script in index.html: class `dark` for any dark-based theme (keeps
// color-scheme right) plus data-theme="neon" for the neon variable set.
// This hook reads that, cycles it, and persists the choice.
//
// No context needed: only the toggle button re-renders; everything else
// restyles through CSS variables.
//
// RN note: on Expo this becomes a ThemeContext holding one of three token
// objects, persisted in AsyncStorage (notes/24-theming-and-polish.md).

const KEY = 'kawmhmoob.theme'
export const THEMES = ['light', 'dark', 'neon']

function readTheme() {
  const el = document.documentElement
  if (el.dataset.theme === 'neon') return 'neon'
  return el.classList.contains('dark') ? 'dark' : 'light'
}

function applyTheme(next) {
  const el = document.documentElement
  el.classList.toggle('dark', next !== 'light')
  if (next === 'neon') el.dataset.theme = 'neon'
  else delete el.dataset.theme
}

export function useTheme() {
  const [theme, setThemeState] = useState(readTheme)

  const setTheme = useCallback((next) => {
    setThemeState(next)
    applyTheme(next)
    try {
      localStorage.setItem(KEY, next)
    } catch {
      /* private mode — theme just won't persist */
    }
  }, [])

  const cycle = useCallback(() => {
    const current = readTheme()
    const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length]
    setTheme(next)
  }, [setTheme])

  return { theme, setTheme, cycle }
}
