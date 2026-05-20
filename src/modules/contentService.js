import debounce from 'debounce'
import contentid from './contentid'

const STORAGE_REGISTRY_KEY = 'quick-note-registry'
const STORAGE_KEY_PREFIX = 'content-'
const MAX_ITEMS = 100
const WAIT_TO_SAVE = 2000

const contentElement = document.querySelector('body > .page')

function contentStorageKey(id) {
  return STORAGE_KEY_PREFIX + id
}

function detectContentId() {
  const searchParams = new URLSearchParams(document.location.search)
  return searchParams.get('note')
}

function assignNewContentId() {
  const id = contentid()
  const newPath = document.location.pathname + `?note=${id}`
  history.replaceState(null, '', newPath)
  return id
}

function registerContentId(id) {
  const registryRaw = localStorage.getItem(STORAGE_REGISTRY_KEY)
  let registry;

  try {
    registry = JSON.parse(registryRaw)

    if (!Array.isArray(registry)) {
      registry = []
    }
  } catch (ex) {
    registry = []
  }

  registry = registry.filter(item => item !== id)
  registry.unshift(id)

  const newRegistry = registry.splice(0, MAX_ITEMS)
  localStorage.setItem(STORAGE_REGISTRY_KEY, JSON.stringify(newRegistry))

  registry.forEach(item => localStorage.removeItem(contentStorageKey(item)))
}

export function loadContent() {
  const id = detectContentId()

  if (id) {
    const savedContents = localStorage.getItem(contentStorageKey(id))
    contentElement.innerHTML = savedContents || ''
  } else {
    assignNewContentId()
  }
}

export function contentAutoSaver() {
  const writeContents = () => {
    const id = detectContentId()
    localStorage.setItem(contentStorageKey(id), contentElement.innerHTML)
    console.log(`Changes saved (${id})...`)
    setTimeout(() => registerContentId(id), 0)
  }

  contentElement.addEventListener('input', debounce(writeContents, WAIT_TO_SAVE))
}
