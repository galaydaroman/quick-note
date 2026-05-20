import debounce from 'debounce'

const STORAGE_KEY = 'contents'
const WAIT_TO_SAVE = 2000

const contentElement = document.querySelector('body > .page')

export function contentAutoSaver() {
  const writeContents = () => {
    localStorage.setItem(STORAGE_KEY, contentElement.innerHTML)
    console.log('Changes saved...')
  }

  contentElement.addEventListener('input', debounce(writeContents, WAIT_TO_SAVE))
}

export function loadContent() {
  const savedContents = localStorage.getItem(STORAGE_KEY)
  contentElement.innerHTML = savedContents
}
