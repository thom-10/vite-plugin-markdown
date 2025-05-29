import { textContent } from 'domutils'
import { Element as DomHandlerElement } from 'domhandler'

import type { ChildNode as DomHandlerChild } from 'domhandler'
import type { MdItem } from './index.js'

export function extractItems(nodes: DomHandlerChild[], filter: string[], replace: boolean): MdItem[] {
  const indicies = nodes.filter(
    rootSibling => rootSibling instanceof DomHandlerElement && (filter.length === 0 || filter.includes(rootSibling.tagName))
  ) as DomHandlerElement[]

  return indicies.map<MdItem>(index => {
    const recureNodes = ['ul', 'ol']
    const contentValue = recureNodes.includes(index.tagName)
      ? extractItems(index.childNodes, filter, replace)
      : textContent(index)

    return {
      level: replace ? index.tagName.replace('h', '') : index.tagName,
      content: contentValue,
    }
  })
}