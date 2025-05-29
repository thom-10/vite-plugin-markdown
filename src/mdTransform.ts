import { TransformResult } from 'rollup'
import MarkdownIt from 'markdown-it'
import Frontmatter, { FrontMatterResult } from 'front-matter'
import { DomUtils, parseDocument } from 'htmlparser2'
import { Element, Node as DomHandlerNode } from 'domhandler'

import { ExportedContent } from './ExportedContent.js'
import { extractItems } from './extractItems.js'
import { extractReact } from './extractReact.js'

import { Mode } from './index.js'
import type { PluginOptions, MdItem } from './index.js'


export const mdtransform = async (code: string, id: string, options: PluginOptions): Promise<TransformResult> => {
  if (!id.endsWith('.md')) return null

  const content = new ExportedContent()
  const fm = (Frontmatter as unknown as ((file: string) => FrontMatterResult<unknown>))(code)
  content.addContext(`const attributes = ${JSON.stringify(fm.attributes)}`)
  content.addExporting('attributes')

  if (options.mode?.includes(Mode.MARKDOWN)) {
    content.addContext(`const markdown = ${JSON.stringify(fm.body)}`)
    content.addExporting('markdown')
  }

  const html = markdownCompiler(options).render(fm.body)
  if (options.mode?.includes(Mode.HTML)) {
    content.addContext(`const html = ${JSON.stringify(html)}`)
    content.addExporting('html')
  }

  if (options.mode?.includes(Mode.TOC)) {
    const nodes = parseDocument(html).childNodes
    const toc: MdItem[] = extractItems(nodes, ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], true)

    content.addContext(`const toc = ${JSON.stringify(toc)}`)
    content.addExporting('toc')
  }

  if (options.mode?.includes(Mode.CONTENT)) {
    const nodes = parseDocument(html).childNodes
    const contents: MdItem[] = extractItems(nodes, [], false)

    content.addContext(`const content = ${JSON.stringify(contents)}`)
    content.addExporting('content')
  }

  if (options.mode?.includes(Mode.REACT)) {
    const compiledReactCode = extractReact(html)
    
    content.addContext(`import React from "react"\nconst SubReactComponent = {}\nconst ReactComponent = ${compiledReactCode}`)
    content.addExporting('ReactComponent')
  }

  if (options.mode?.includes(Mode.VUE)) {
    const root = parseDocument(html).childNodes

    // Top-level <pre> tags become <pre v-pre>
    root.forEach((node: DomHandlerNode) => {
      if (node instanceof Element) {
        if (['pre', 'code'].includes(node.tagName)) {
          node.attribs['v-pre'] = 'true'
        }
      }
    })

    // Any <code> tag becomes <code v-pre> excepting under `<pre>`
    const markCodeAsPre = (node: DomHandlerNode): void => {
      if (node instanceof Element) {
        if (node.tagName === 'code') node.attribs['v-pre'] = 'true'
        if (node.childNodes.length > 0) node.childNodes.forEach(markCodeAsPre)
      }
    }
    root.forEach(markCodeAsPre)

    const { code: compiledVueCode } = (await import('@vue/compiler-sfc')).compileTemplate({ source: DomUtils.getOuterHTML(root, { decodeEntities: true }), filename: id, id })
    content.addContext(compiledVueCode.replace('\nexport function render(', '\nfunction vueRender(') + `\nconst VueComponent = { render: vueRender }\nVueComponent.__hmrId = ${JSON.stringify(id)}\nconst VueComponentWith = (components) => ({ components, render: vueRender })\n`)
    content.addExporting('VueComponent')
    content.addExporting('VueComponentWith')
  }

  return {
    code: content.export(),
  }
}

const markdownCompiler = (options: PluginOptions): MarkdownIt | { render: (body: string) => string } => {
  if (options.markdownIt) {
    if (options.markdownIt instanceof MarkdownIt || (options.markdownIt?.constructor?.name === 'MarkdownIt')) {
      return options.markdownIt as MarkdownIt
    } else if (typeof options.markdownIt === 'object') {
      return MarkdownIt(options.markdownIt)
    }
  } else if (options.markdown) {
    return { render: options.markdown }
  }
  return MarkdownIt({ html: true, xhtmlOut: options.mode?.includes(Mode.REACT) }) // TODO: xhtmlOut should be got rid of in next major update
}