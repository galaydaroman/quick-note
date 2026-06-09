import debounce from 'debounce'
import contentManager from '../modules/contentManager'
import { getContentRelativeUrl } from '../modules/contentUrlService'
import { getCursorOffset, setCursorOffset } from '../modules/cursorOffsetService'
import { parseHtmlTopText } from '../modules/contentParser'

const WAIT_TO_SAVE = 2000
const MAX_TITLE_LENGTH = 16
const PREFIX_NOTSAVED_TITLE = '*'

class ContentEditor extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.contentNavigator = document.querySelector('body > content-navigator')
    this.onEditorChange = debounce(this.saveContent.bind(this), WAIT_TO_SAVE)
    this.defaultTabTitle = document.title

    this.initializeContent()
    this.addEventListener('input', this.onEditorChange)
    this.addEventListener('keydown', this.onEditorKeyDown.bind(this))

    window.addEventListener('popstate', this.initializeContent.bind(this))
    window.addEventListener('storage', this.onStorageChange.bind(this))

    document.addEventListener('visibilitychange', this.onVisibilityChange.bind(this))
  }

  initializeContent() {
    const id = this.detectPageContentId()

    if (id) {
      const content = contentManager.readContent(id)
      this.setContent(content)
    } else {
      this.generatePageContentId()
    }
  }

  onEditorKeyDown(event) {
    if (event.metaKey === true || event.ctrlKey === true) {
      if (event.key === 'p') {
        event.preventDefault()
        this.contentNavigator.show()
        setTimeout(() => this.onEditorChange.flush(), 0)
      } else if (event.key === 'n') {
        event.preventDefault()
        this.onEditorChange.flush()
        this.setContent('')
        this.generatePageContentId()
      }
    }
  }

  onStorageChange(event) {
    if (event.storageArea === contentManager.storage) {
      const id = this.detectPageContentId()
      const storageKey = contentManager.contentStorageKey(id)

      if (event.key === storageKey) {
        if (event.newValue === null) {
          // key was deleted
          this.updateTabTitle()
        } else {
          this.setContent(event.newValue, { preserveCursorPosition: true })
        }
      } else if (event.key === null) {
        // key (and all storage) was cleaned
        this.updateTabTitle()
      }
    }
  }

  onVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      this.onEditorChange.flush()
    }
  }

  detectPageContentId() {
    const searchParams = new URLSearchParams(document.location.search)
    return searchParams.get('note')
  }

  generatePageContentId() {
    const id = contentManager.generateId()
    const newPath = getContentRelativeUrl(id)
    history.replaceState(null, '', newPath)
    return id
  }

  setContent(text, options = {}) {
    const preserveCursorPosition = options.preserveCursorPosition || false
    let cursorOffset = 0;

    if (preserveCursorPosition) {
      cursorOffset = getCursorOffset(this)
    }

    this.innerHTML = text || ''

    if (preserveCursorPosition && cursorOffset > 0) {
      setCursorOffset(this, cursorOffset)
    }

    setTimeout(this.updateTabTitle.bind(this), 0)
  }

  saveContent() {
    const id = this.detectPageContentId()
    contentManager.writeContent(id, this.innerHTML)
    const contentSizeKb = Math.round(10 * this.innerHTML.length / 1024) / 10
    console.log(`Changes saved "${id}" / ${contentSizeKb}kb ...`)

    setTimeout(this.updateTabTitle.bind(this), 0)
  }

  notifyContentWasDeleted(id) {
    if (id === this.detectPageContentId()) {
      this.updateTabTitle()
    }
  }

  updateTabTitle() {
    const id = this.detectPageContentId()
    const markAsNotSaved = !contentManager.allContentIds().includes(id)

    let newTitle = parseHtmlTopText(this.innerHTML) || ''

    if (newTitle.length > MAX_TITLE_LENGTH) {
      newTitle = newTitle.slice(0, MAX_TITLE_LENGTH - 3).trim() + '...'
    }

    if (newTitle.length) {
      if (markAsNotSaved) {
        newTitle = PREFIX_NOTSAVED_TITLE + newTitle
      }

      document.title = [newTitle, this.defaultTabTitle].join(' - ')
    } else {
      document.title = this.defaultTabTitle
    }
  }
}

customElements.define('content-editor', ContentEditor)
