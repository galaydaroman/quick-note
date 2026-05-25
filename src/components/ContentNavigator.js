import contentManager from '../modules/contentManager'
import { createIcons, Trash } from 'lucide'
import { getCursorOffset, setCursorOffset } from '../modules/cursorOffsetService'
import { getContentRelativeUrl } from '../modules/contentUrlService'
import { parseHtmlTopText } from '../modules/contentParser'

class ContentNavigator extends HTMLElement {
  constructor() {
    super()

    this.activeIndex = -1
    this.previousActiveIndex = -1
    this.allItems = []
    this.items = []

    this.addEventListener('keydown', this.keydownHandler.bind(this))
  }

  connectedCallback() {
    this.editor = document.querySelector('body > content-editor')
    this.searchInput = this.querySelector('input.search-input')
    this.noteResults = this.querySelector('#note-results')

    if (this.searchInput) {
      this.searchInput.addEventListener('input', this.searchHandler.bind(this))
    }
  }

  show() {
    this.prepareEditor()
    this.loadItems()
    this.render()
    this.searchInput.value = ''
    this.style.removeProperty('display')
    this.searchInput.focus()
  }

  hide() {
    this.style.setProperty('display', 'none')
    this.editor.focus()
    this.editor.removeEventListener('click', this.onEditorClicked)
    this.onEditorClicked = null

    this.savedEditorContent = null
    this.savedCursorOffset = null
    this.activeIndex = -1
    this.previousActiveIndex = -1
  }

  hideAndRestore() {
    this.style.setProperty('display', 'none')
    this.editor.innerHTML = this.savedEditorContent
    setCursorOffset(this.editor, this.savedCursorOffset)
    this.editor.focus()
    this.editor.removeEventListener('click', this.onEditorClicked)
    this.onEditorClicked = null

    this.savedEditorContent = null
    this.savedCursorOffset = null
    this.activeIndex = -1
    this.previousActiveIndex = -1
  }

  loadItems() {
    this.allItems = contentManager.allContentIds().map(id => {
      const title = this.getItemTitle(id)

      return {
        id,
        title,
        node: this.createItemNode(id, title)
      }
    })

    this.items = [...this.allItems]
  }

  getItemTitle(id) {
    const itemContent = contentManager.readContent(id)
    return parseHtmlTopText(itemContent) || '--'
  }

  createItemNode(id, title) {
    const tempElement = document.createElement('div')
    tempElement.innerHTML = `
      <div role="option" id="item-${id}" class="list-item">
        <div class="item-title">${title}</div>
        <div class="item-remove">
          <i data-lucide="trash"></i>
        </div>
      </div>
    `

    const node = tempElement.children[0]

    node.addEventListener('click', () => {
      this.renderItemContent(id)
      this.openItem(id)
    })

    const removeIcon = node.querySelector('.item-remove')

    if (removeIcon) {
      removeIcon.addEventListener('click', event => {
        event.preventDefault()
        event.stopPropagation()
        this.removeItem(id)
      })
    }

    return node
  }

  removeItem(id) {
    contentManager.deleteContent(id)
    this.loadItems()
    this.searchHandler()
    this.searchInput.focus()
  }

  render() {
    this.noteResults.innerHTML = ''

    this.items.forEach(({ node }) => {
      node.classList.remove('active')
      this.noteResults.appendChild(node)
    })

    this.setupIcons()
  }

  searchHandler() {
    const searchText = this.searchInput.value

    this.items = this.allItems.filter(({ title }) => {
      const lowerTitle = (title || '').toLowerCase()
      const lowerSearchText = (searchText || '').toLowerCase()
      return lowerTitle.includes(lowerSearchText)
    })

    if (searchText && this.items.length) {
      this.activeIndex = 0
      this.previousActiveIndex = -1
    } else {
      this.activeIndex = -1
      this.previousActiveIndex = -1
    }

    this.render()
    this.updateActiveItem()
    this.renderActiveItemContent()
  }

  keydownHandler(event) {
    if (this.items.length > 0) {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        this.previousActiveIndex = this.activeIndex
        this.activeIndex = (this.activeIndex + 1) % this.items.length
        this.updateActiveItem()
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        this.previousActiveIndex = this.activeIndex
        this.activeIndex = (this.activeIndex - 1 + this.items.length) % this.items.length
        this.updateActiveItem()
      } else if (event.key === 'Enter') {
        if (this.activeIndex > -1 && this.activeIndex < this.items.length) {
          event.preventDefault()
          const { id } = this.items[this.activeIndex]
          this.openItem(id)
        }
      }
    }

    if (event.key === 'Escape') {
      this.hideAndRestore()
    }
  }

  openItem(id) {
    const url = getContentRelativeUrl(id)

    if (document.location.href.includes(url)) {
      this.hideAndRestore()
    } else {
      history.pushState(null, '', url)
      this.hide()
    }
  }

  updateActiveItem() {
    if (this.previousActiveIndex >= 0) {
      const { node } = this.items[this.previousActiveIndex]

      if (node) {
        node.classList.remove('active')
      }
    }

    if (this.activeIndex >= 0) {
      const { node } = this.items[this.activeIndex]

      if (node) {
        node.classList.add('active')
        // Tell screen readers which option is active
        this.searchInput.setAttribute('aria-activedescendant', node.id)

        // Auto-scroll parent container if the node goes out of view
        node.scrollIntoView({ block: 'nearest' })
        setTimeout(this.renderActiveItemContent.bind(this), 0)
      }
    } else {
      this.searchInput.removeAttribute('aria-activedescendant')
    }
  }

  renderActiveItemContent() {
    if (this.activeIndex >= 0) {
      const { id } = this.items[this.activeIndex]
      this.renderItemContent(id)
    } else {
      this.editor.innerHTML = this.savedEditorContent
    }
  }

  // TODO: this needs to load from "this.savedEditorContent" as well
  renderItemContent(id) {
    if (id) {
      const activeItemContent = contentManager.readContent(id)
      this.editor.innerHTML = activeItemContent
    }
  }

  prepareEditor() {
    this.savedCursorOffset = getCursorOffset(this.editor)
    this.savedEditorContent = this.editor.innerHTML

    this.onEditorClicked = () => {
      if (this.activeIndex > -1 && this.activeIndex < this.items.length) {
        const { id } = this.items[this.activeIndex]
        this.openItem(id)
      } else {
        this.hide()
      }
    }

    this.editor.addEventListener('click', this.onEditorClicked, { once: true })
  }

  setupIcons() {
    createIcons({
      icons: {
        Trash
      }
    })
  }
}

customElements.define('content-navigator', ContentNavigator)
