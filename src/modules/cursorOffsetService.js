// Get the current cursor character offset relative to the parent container
export function getCursorOffset(container) {
  const selection = window.getSelection()
  if (selection.rangeCount === 0) return 0;

  const range = selection.getRangeAt(0)
  const preCaretRange = range.cloneRange()

  // Select everything from the start of the container to the cursor
  preCaretRange.selectNodeContents(container)
  preCaretRange.setEnd(range.endContainer, range.endOffset)

  // The length of the selected text is the character offset of the cursor
  return preCaretRange.toString().length
}

// Restore the cursor position using a character offset
export function setCursorOffset(container, offset) {
  let charCount = 0
  const range = document.createRange()
  range.setStart(container, 0)
  range.collapse(true)

  const nodeQueue = [container]
  let found = false

  while (nodeQueue.length > 0) {
    const node = nodeQueue.shift()

    if (node.nodeType === Node.TEXT_NODE) {
      const nextCharCount = charCount + node.length

      if (offset >= charCount && offset <= nextCharCount) {
        range.setStart(node, offset - charCount)
        range.collapse(true)
        found = true
        break
      }

      charCount = nextCharCount
    } else {
      // Add child nodes to the queue
      for (let i = 0; i < node.childNodes.length; i++) {
        nodeQueue.push(node.childNodes[i])
      }
    }
  }

  if (found) {
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
  }
}
