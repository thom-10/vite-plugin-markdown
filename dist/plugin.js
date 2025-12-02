import MarkdownIt from 'markdown-it';
import { mdTransform, Mode } from './mdTransform.js';
const getMarkdownCompiler = (args) => {
    let compiler = null;
    const { markdown, markdownIt, mode = [] } = args;
    if (markdownIt) {
        if (markdownIt instanceof MarkdownIt ||
            markdownIt.constructor.name === 'MarkdownIt') {
            compiler = (body) => markdownIt.render(body);
        }
        else if (typeof markdownIt === 'object') {
            compiler = (body) => MarkdownIt(markdownIt).render(body);
        }
    }
    else if (markdown) {
        compiler = markdown;
    }
    return compiler !== null
        ? compiler
        : // TODO: xhtmlOut should be got rid of in next major update
            (body) => MarkdownIt({
                html: true,
                xhtmlOut: mode.includes(Mode.REACT),
            }).render(body);
};
const plugin = (options = {}) => {
    const { mode = [] } = options;
    const mdRender = getMarkdownCompiler(options);
    return {
        name: 'vite-plugin-markdown',
        enforce: 'pre',
        transform(code, id) {
            return mdTransform(code, id, mode, mdRender);
        },
    };
};
export { plugin };
//# sourceMappingURL=plugin.js.map