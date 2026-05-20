const THEME_KEY = 'theme'

const detectSystemTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function setupTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY)

  document.documentElement.classList.add(savedTheme || detectSystemTheme())

  const toggle = document.querySelector('#theme-toggle')

  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark')
    const next = isDark ? 'light' : 'dark'
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(next)
    localStorage.setItem(THEME_KEY, next)
  })
}
