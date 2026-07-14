import { useEffect, useState } from 'react'

export type ClassicTheme = 'light' | 'dark'

const STORAGE_KEY = 'classic-theme'

function initialTheme(): ClassicTheme {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useClassicTheme() {
  const [theme, setTheme] = useState<ClassicTheme>(initialTheme)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  return { theme, toggle }
}
