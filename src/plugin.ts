import type { Options as MarkdownItOptions } from 'markdown-it';
import MarkdownIt from 'markdown-it';
import type { Plugin } from 'vite';
import { mdTransform, Mode } from './mdTransform.js';

interface PluginOptions {
    mode?: Mode[];
    markdown?: (body: string) => string;
    markdownIt?: MarkdownIt | MarkdownItOptions;
}

type MdCompilerFunc = (body: string) => string;

const getMarkdownCompiler = (args: PluginOptions): MdCompilerFunc => {
    let compiler: MdCompilerFunc | null = null;
    const { markdown, markdownIt, mode = [] } = args;

    if (markdownIt) {
        if (
            markdownIt instanceof MarkdownIt ||
            markdownIt.constructor.name === 'MarkdownIt'
        ) {
            compiler = (body: string) =>
                (markdownIt as MarkdownIt).render(body);
        } else if (typeof markdownIt === 'object') {
            compiler = (body: string) => MarkdownIt(markdownIt).render(body);
        }
    } else if (markdown) {
        compiler = markdown;
    }

    return compiler !== null
        ? compiler
        : // TODO: xhtmlOut should be got rid of in next major update
          (body: string) =>
              MarkdownIt({
                  html: true,
                  xhtmlOut: mode.includes(Mode.REACT),
              }).render(body);
};

const plugin = (options: PluginOptions = {}) => {
    const { mode = [] } = options;
    const mdRender = getMarkdownCompiler(options);

    return {
        name: 'vite-plugin-markdown',
        enforce: 'pre',
        transform(code: string, id: string) {
            return mdTransform(code, id, mode, mdRender);
        },
    } satisfies Plugin;
};

export { plugin };
export type { MdCompilerFunc, PluginOptions };
