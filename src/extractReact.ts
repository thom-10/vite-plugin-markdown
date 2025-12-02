import { parseDocument } from 'htmlparser2';
import { Element as DomHandlerElement } from 'domhandler';
import { HTML } from './HTML.js';

import type { Node as DomHandlerNode } from 'domhandler';
import { ExportedContent } from './ExportedContent.js';

export async function extractReact(html: string, content: ExportedContent) {
    // if (options.mode?.includes(Mode.REACT)) {
    const root = parseDocument(html, { lowerCaseTags: false }).childNodes;
    const subComponentNamespace = 'SubReactComponent';

    const requiredComponents: string[] = [];

    const markCodeAsPre = (node: DomHandlerNode): void => {
        if (node instanceof DomHandlerElement) {
            if (node.tagName.match(/^[A-Z].+/)) {
                requiredComponents.push(`'${node.tagName}'`);
                node.tagName = `${subComponentNamespace}.${node.tagName}`;
            } else if (
                ['pre', 'code'].includes(node.tagName) &&
                node.attribs?.class
            ) {
                node.attribs.className = node.attribs.class;
                delete node.attribs.class;
            } else if (node.tagName === 'code') {
                const codeContent = HTML.getInner(node, {
                    decodeEntities: true,
                });
                node.attribs.dangerouslySetInnerHTML = `vfm{{ __html: \`${codeContent.replace(/([\\`])/g, '\\$1')}\`}}vfm`;
                node.childNodes = [];
            }

            if (node.childNodes.length > 0) {
                node.childNodes.forEach(markCodeAsPre);
            }
        }
    };
    root.forEach(markCodeAsPre);

    const h = HTML.getOuter(root, { selfClosingTags: true })
        .replace(/"vfm{{/g, '{{')
        .replace(/}}vfm"/g, '}}');

    const reactCode = `
      const markdown =
        <div>
          ${h}
        </div>
    `;
    
    const compiledReactCode = `
      function (props) {
        const required = [${requiredComponents.join(',')}]
        const missing = required.reduce((result, entry) => {
            if(Object.hasOwn(props, entry) == false) {
              result.push(entry);
            }
            return result;
        }, []);

        if(missing.length > 0) {
          throw Error("imported markdown includes react-components missing in props: [" + missing.join(',') + "]");
        }

        Object.keys(props).forEach(function (key) {
          ${subComponentNamespace}[key] = props[key]
        })
        ${(await import('@babel/core')).transformSync(reactCode, { ast: false, presets: ['@babel/preset-react'] })?.code}
        return markdown;
      }
    `;
    // content.addContext(`import React from "react"\nconst ${subComponentNamespace} = {}\nconst ReactComponent = ${compiledReactCode}`)
    // content.addExporting('ReactComponent')

    content.addInternal(
        'import React from "react"; \n' +
            `const ${subComponentNamespace} = {};\n`
    );
    content.addExport('ReactComponent', compiledReactCode);
}
