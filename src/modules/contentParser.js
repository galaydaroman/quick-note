export function parseHtmlTopText(htmlString) {
  if (!htmlString || typeof htmlString !== 'string') {
    return null
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')

  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null, false)
  let node;

  while ((node = walker.nextNode())) {
    const lines = node.nodeValue.split(/\r?\n/)

    for (const line of lines) {
      const trimmed = line.trim()

      if (trimmed) {
        return trimmed
      }
    }
  }

  return null
}
