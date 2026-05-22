import debounce from 'debounce'
import contentManager from './contentManager'
import { getContentRelativeUrl } from './contentUrlService'

const WAIT_TO_SAVE = 2000

const contentElement = document.querySelector('body > .page')

function detectContentId() {
  const searchParams = new URLSearchParams(document.location.search)
  return searchParams.get('note')
}

function assignNewContentId() {
  const id = contentManager.generateId()
  const newPath = getContentRelativeUrl(id)
  history.replaceState(null, '', newPath)
  return id
}

function contentAutoSaver() {
  const writeContents = () => {
    const id = detectContentId()
    contentManager.writeContent(id, contentElement.innerHTML)
    console.log(`Changes saved (${id})...`)
  }

  contentElement.addEventListener('input', debounce(writeContents, WAIT_TO_SAVE))
}

function setupKeyBindings() {
  const contentNavigator = document.querySelector('body > content-navigator')

  contentElement.addEventListener('keydown', event => {
    if (event.key === 'p' && event.metaKey === true) {
      event.preventDefault()
      contentNavigator.show()
    }
  })
}

export function loadContent() {
  const id = detectContentId()

  if (id) {
    const savedContents = contentManager.readContent(id)
    contentElement.innerHTML = savedContents || ''
  } else {
    assignNewContentId()
  }
}

export function setupEditor() {
  contentAutoSaver()
  setupKeyBindings()
}
