import './style.css'
import debounce from 'debounce'

const STORAGE_KEY = 'contents'
const THEME_KEY = 'theme'
const WAIT_TO_SAVE = 2000

const contentElement = document.querySelector('body > .page')

const writeContents = () => {
  localStorage.setItem(STORAGE_KEY, contentElement.innerHTML)
  console.log('Changes saved...')
}

contentElement.addEventListener('input', debounce(writeContents, WAIT_TO_SAVE))

const savedContents = localStorage.getItem(STORAGE_KEY)
contentElement.innerHTML = savedContents

const savedTheme = localStorage.getItem(THEME_KEY)

const detectSystemTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

document.documentElement.classList.add(savedTheme || detectSystemTheme())

const toggle = document.querySelector('#theme-toggle')

toggle.addEventListener('click', () => {
  const isDark = document.documentElement.classList.contains('dark')
  const next = isDark ? 'light' : 'dark'
  document.documentElement.classList.remove('dark', 'light')
  document.documentElement.classList.add(next)
  localStorage.setItem(THEME_KEY, next)
})
