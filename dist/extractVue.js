import { DomUtils, parseDocument } from 'htmlparser2';
import { Element as DomHandlerElement } from 'domhandler';
export async function extractVue(html, id, content) {
    const root = parseDocument(html).childNodes;
    const isElement = (value) => {
        return value instanceof DomHandlerElement;
    };
    // Top-level <pre> tags become <pre v-pre>
    root.forEach((node) => {
        if (isElement(node)) {
            if (['pre', 'code'].includes(node.tagName)) {
                node.attribs['v-pre'] = 'true';
            }
        }
    });
    // Any <code> tag becomes <code v-pre> excepting under `<pre>`
    const markCodeAsPre = (node) => {
        if (isElement(node)) {
            if (node.tagName === 'code')
                node.attribs['v-pre'] = 'true';
            if (node.childNodes.length > 0)
                node.childNodes.forEach(markCodeAsPre);
        }
    };
    root.forEach(markCodeAsPre);
    const { code: compiledVueCode } = (await import('@vue/compiler-sfc')).compileTemplate({
        source: DomUtils.getOuterHTML(root, { decodeEntities: true }),
        filename: id,
        id,
    });
    content.addInternal(compiledVueCode.replace('\nexport function render(', '\nfunction vueRender('));
    content.addExport('VueComponent', `{ render: vueRender }\nVueComponent.__hmrId = ${JSON.stringify(id)}`);
    content.addExport('VueComponentWith', '(components) => ({ components, render: vueRender })');
}
//# sourceMappingURL=extractVue.js.map