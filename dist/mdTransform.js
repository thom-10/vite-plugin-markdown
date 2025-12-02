import fm from 'front-matter';
import { parseDocument } from 'htmlparser2';
import { ExportedContent } from './ExportedContent.js';
import { extractItems } from './extractItems.js';
import { extractReact } from './extractReact.js';
import { extractVue } from './extractVue.js';
var Mode;
(function (Mode) {
    Mode["HTML"] = "html";
    Mode["TOC"] = "toc";
    Mode["CONTENT"] = "content";
    Mode["REACT"] = "react";
    Mode["VUE"] = "vue";
})(Mode || (Mode = {}));
const mdTransform = async (code, id, mode, mdRender) => {
    if (!id.endsWith('.md'))
        return null;
    const content = new ExportedContent();
    const { attributes, body } = fm(code);
    content.addExport('attributes', JSON.stringify(attributes));
    content.addExport('markdown', JSON.stringify(body));
    let html = null;
    const getHtml = () => {
        if (html === null) {
            html = mdRender(body);
        }
        return html;
    };
    if (mode?.includes(Mode.HTML)) {
        content.addExport(Mode.HTML, JSON.stringify(getHtml()));
    }
    if (mode?.includes(Mode.TOC)) {
        const nodes = parseDocument(getHtml()).childNodes;
        const items = extractItems(nodes, ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], true);
        content.addExport(Mode.TOC, JSON.stringify(items));
    }
    if (mode?.includes(Mode.CONTENT)) {
        const nodes = parseDocument(getHtml()).childNodes;
        const items = extractItems(nodes, [], false);
        content.addExport(Mode.CONTENT, JSON.stringify(items));
    }
    if (mode?.includes(Mode.REACT)) {
        await extractReact(getHtml(), content);
    }
    if (mode?.includes(Mode.VUE)) {
        await extractVue(getHtml(), id, content);
    }
    return {
        code: content.export(),
    };
};
export { mdTransform, Mode };
//# sourceMappingURL=mdTransform.js.map