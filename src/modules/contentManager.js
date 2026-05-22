import { customAlphabet } from 'nanoid'
import { alphanumeric } from 'nanoid-dictionary'

const STORAGE_REGISTRY_KEY = 'quick-note-registry'
const STORAGE_KEY_PREFIX = 'content-'
const MAX_ITEMS = 100

class ContentManager {
  constructor() {
    this.nanoid = customAlphabet(alphanumeric, 4)
    this.storage = localStorage
  }

  generateId() {
    return this.nanoid()
  }

  contentStorageKey(id) {
    return STORAGE_KEY_PREFIX + id
  }

  readContent(id) {
    return this.storage.getItem(this.contentStorageKey(id))
  }

  writeContent(id, content) {
    this.storage.setItem(this.contentStorageKey(id), content)
    setTimeout(() => this.registerContentId(id), 0)
  }

  allContentIds() {
    const raw = this.storage.getItem(STORAGE_REGISTRY_KEY)
    let registry;

    try {
      registry = JSON.parse(raw)

      if (!Array.isArray(registry)) {
        registry = []
      }
    } catch {
      registry = []
    }

    return registry
  }

  registerContentId(id) {
    let registry = this.allContentIds()
    registry = registry.filter(item => item !== id)
    registry.unshift(id)

    const newRegistry = registry.splice(0, MAX_ITEMS)
    this.storage.setItem(STORAGE_REGISTRY_KEY, JSON.stringify(newRegistry))

    registry.forEach(item => {
      this.storage.removeItem(this.contentStorageKey(item))
    })
  }
}

export default new ContentManager()
