import { mdtransform } from './mdTransform.js'
import { Mode } from './mdTransform.js'

import type MarkdownIt from 'markdown-it'
import type { Options as MarkdownItOptions } from 'markdown-it'
import type { Plugin } from 'vite'

export interface PluginOptions {
  mode?: Mode[]
  markdown?: (body: string) => string
  markdownIt?: MarkdownIt | MarkdownItOptions
}

export interface MdItem {
  level: string;
  content: string | MdItem[];
}

export const plugin = (options: PluginOptions = {}): Plugin => {
  return {
    name: 'vite-plugin-markdown',
    // enforce: 'pre',
    transform (code, id) {
      return mdtransform(code, id, options)
    },
  }
}

export {Mode}

export default plugin
