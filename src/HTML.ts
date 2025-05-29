import renderHTML from 'dom-serializer'
import { hasChildren } from 'domhandler'

import type { AnyNode as DomHandlerAny, Node as DomHandlerNode } from 'domhandler'
import type { DomSerializerOptions } from 'dom-serializer'

export class HTML {
  static getOuter(node: DomHandlerAny | ArrayLike<DomHandlerAny>, options: DomSerializerOptions) {
    return renderHTML(node, options)
  }

  static getInner(node: DomHandlerAny, options: DomSerializerOptions) {
    return this.hasChildren(node)
        ? node.children.map((node) => this.getOuter(node, options)).join('')
        : ''
  }

  static hasChildren(node: DomHandlerNode) {
    return hasChildren(node)
  }
}