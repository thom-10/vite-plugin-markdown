import { TransformResult } from 'rollup'
import fm from 'front-matter'
import MarkdownIt from 'markdown-it'
import { parseDocument } from 'htmlparser2'

import { Mode } from './index.js'
import { NeoContent } from './NeoContent.js'
import { extractItems } from './extractItems.js'
import { extractReact } from './extractReact.js'
import { extractVue } from './extractVue.js'

import type { PluginOptions, MdItem } from './index.js'


export const neotransform = async (code: string, id: string, options: PluginOptions): Promise<TransformResult> => {
  if (!id.endsWith('.md')) return null

  const content = new NeoContent()

  const { attributes, body } = (fm as unknown as typeof fm.default)(code)
  let html: string | null = null

  content.addExport('attributes', JSON.stringify(attributes))
  content.addExport('markdown', body)

  const getHtml = () => {
    if (html === null) {
      html = markdownCompiler(options).render(body)
    }
    return html
  }

  if (options.mode?.includes(Mode.TOC)) {
    const nodes = parseDocument(getHtml()).childNodes
    const items: MdItem[] = extractItems(nodes, ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], true)

    content.addExport(Mode.TOC, JSON.stringify(items))
  }

   if (options.mode?.includes(Mode.CONTENT)) {
    const nodes = parseDocument(getHtml()).childNodes
    const items: MdItem[] = extractItems(nodes, [], true)

    content.addExport(Mode.CONTENT, JSON.stringify(items))
  }

  if (options.mode?.includes(Mode.REACT)) {
    const compiledReactCode = await extractReact(getHtml())
    
    content.addExport('ReactComponent', compiledReactCode)
  }

  if (options.mode?.includes(Mode.VUE)) {
    const compiledReactCode = await extractVue(getHtml(), id)
    
    content.addExport('VueComponent', compiledReactCode)
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