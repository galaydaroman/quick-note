import debounce from 'debounce'
import contentManager from '../modules/contentManager'
import { getContentRelativeUrl } from '../modules/contentUrlService'

const WAIT_TO_SAVE = 2000

class ContentEditor extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.contentNavigator = document.querySelector('body > content-navigator')
    this.onEditorChange = debounce(this.saveContent.bind(this), WAIT_TO_SAVE)

    this.initializeContent()
    this.addEventListener('input', this.onEditorChange)

    this.addEventListener('keydown', event => {
      if (event.metaKey === true || event.ctrlKey === true) {
        if (event.key === 'p') {
          event.preventDefault()
          this.contentNavigator.show()
          setTimeout(() => this.onEditorChange.flush(), 0)
        } else if (event.key === 'n') {
          event.preventDefault()
          this.onEditorChange.flush()
          this.innerHTML = ''
          this.generatePageContentId()
        }
      }
    })

    window.addEventListener('popstate', this.initializeContent.bind(this))
  }

  initializeContent() {
    const id = this.detectPageContentId()

    if (id) {
      const savedContents = contentManager.readContent(id)
      this.innerHTML = savedContents || ''
    } else {
      this.generatePageContentId()
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

  saveContent() {
    const id = this.detectPageContentId()
    contentManager.writeContent(id, this.innerHTML)
    const contentSizeKb = Math.round(10 * this.innerHTML.length / 1024) / 10
    console.log(`Changes saved "${id}" / ${contentSizeKb}kb ...`)
  }
}

customElements.define('content-editor', ContentEditor)
