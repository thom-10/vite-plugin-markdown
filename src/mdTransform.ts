import fm from 'front-matter';
import { parseDocument } from 'htmlparser2';
import type { TransformResult } from 'rollup';
import { ExportedContent } from './ExportedContent.js';
import type { TocItem, TagItem } from './extractItems.js';
import { extractItems } from './extractItems.js';
import { extractReact } from './extractReact.js';
import { extractVue } from './extractVue.js';
import type { MdCompilerFunc } from './plugin.js';

enum Mode {
    HTML = 'html',
    TOC = 'toc',
    CONTENT = 'content',
    REACT = 'react',
    VUE = 'vue',
}

const mdTransform = async (
    code: string,
    id: string,
    mode: Mode[],
    mdRender: MdCompilerFunc
): Promise<TransformResult> => {
    if (!id.endsWith('.md')) return null;

    const content = new ExportedContent();

    const { attributes, body } = (fm as unknown as typeof fm.default)(code);

    content.addExport('attributes', JSON.stringify(attributes));
    content.addExport('markdown', JSON.stringify(body));

    let html: string | null = null;
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
        const items: TocItem[] = extractItems(
            nodes,
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
            true
        );

        content.addExport(Mode.TOC, JSON.stringify(items));
    }

    if (mode?.includes(Mode.CONTENT)) {
        const nodes = parseDocument(getHtml()).childNodes;
        const items: TagItem[] = extractItems(nodes, [], false);

        content.addExport(Mode.CONTENT, JSON.stringify(items));
    }

    if (mode?.includes(Mode.REACT)) {
        const compiledReactCode = await extractReact(getHtml());

        content.addInternal('import React from "react"');
        content.addExport('ReactComponent', compiledReactCode);
    }

    if (mode?.includes(Mode.VUE)) {
        const compiledVueCode = await extractVue(getHtml(), id);

        content.addInternal(`${compiledVueCode}`);
        content.addExport('VueComponent', '');
        content.addExport('VueComponentWith', '');
    }

    return {
        code: content.export(),
    };
};

export { mdTransform, Mode };
