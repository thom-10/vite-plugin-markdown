import { DomUtils, parseDocument } from 'htmlparser2'

import { Element, type Node as DomHandlerNode } from 'domhandler'

export async function extractReact(html: string) {
// if (options.mode?.includes(Mode.REACT)) {
    const root = parseDocument(html, { lowerCaseTags: false }).childNodes
    const subComponentNamespace = 'SubReactComponent'

    const markCodeAsPre = (node: DomHandlerNode): void => {
      if (node instanceof Element) {
        if (node.tagName.match(/^[A-Z].+/)) {
          node.tagName = `${subComponentNamespace}.${node.tagName}`
        }
        if (['pre', 'code'].includes(node.tagName) && node.attribs?.class) {
          node.attribs.className = node.attribs.class
          delete node.attribs.class
        }

        if (node.tagName === 'code') {
          const codeContent = DomUtils.getInnerHTML(node, { decodeEntities: true })
          node.attribs.dangerouslySetInnerHTML = `vfm{{ __html: \`${codeContent.replace(/([\\`])/g, '\\$1')}\`}}vfm`
          node.childNodes = []
        }

        if (node.childNodes.length > 0) {
          node.childNodes.forEach(markCodeAsPre)
        }
      }
    }
    root.forEach(markCodeAsPre)

    const h = DomUtils.getOuterHTML(root, { selfClosingTags: true }).replace(/"vfm{{/g, '{{').replace(/}}vfm"/g, '}}')

    const reactCode = `
      const markdown =
        <div>
          ${h}
        </div>
    `
    const compiledReactCode = `
      function (props) {
        Object.keys(props).forEach(function (key) {
          SubReactComponent[key] = props[key]
        })
        ${(await import('@babel/core')).transformSync(reactCode, { ast: false, presets: ['@babel/preset-react'] })?.code}
        return markdown
      }
    `
    // content.addContext(`import React from "react"\nconst ${subComponentNamespace} = {}\nconst ReactComponent = ${compiledReactCode}`)
    // content.addExporting('ReactComponent')
    return compiledReactCode
}