import { textContent } from 'domutils'

import type { MdItem } from './index.js'
import type { AnyNode } from 'domhandler'

export function extractItems(nodes: ChildNode[], filter: string[], replace: boolean): MdItem[] {
  const indicies = nodes.filter(
    rootSibling => rootSibling instanceof Element && (filter.length === 0 || filter.includes(rootSibling.tagName))
  ) as unknown as Element[]

  return indicies.map<MdItem>(index => {
    const recureNodes = ['ul']
    const contentValue = recureNodes.includes(index.tagName)
      ? extractItems(index.childNodes as unknown as ChildNode[], filter, replace)
      : textContent(index as unknown as AnyNode)


    return {
      level: replace ? index.tagName.replace('h', ''): index.tagName,
      content: contentValue,
    }
  })
}