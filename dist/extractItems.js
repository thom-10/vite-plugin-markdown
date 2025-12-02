import { Element as DomHandlerElement } from 'domhandler';
import { textContent } from 'domutils';
function extractItems(nodes, filter, toc) {
    const indicies = nodes.filter((rootSibling) => rootSibling instanceof DomHandlerElement &&
        (filter.length === 0 || filter.includes(rootSibling.tagName)));
    const recureNodes = ['ul', 'ol', 'blockquote'];
    return indicies.map((index) => {
        const { tagName } = index;
        if (toc) {
            const contentValue = textContent(index);
            return {
                level: Number(tagName.replace('h', '')),
                content: contentValue,
            };
        }
        const contentValue = recureNodes.includes(tagName)
            ? extractItems(index.childNodes, filter, false)
            : textContent(index);
        return {
            tag: tagName,
            content: contentValue,
        };
    });
}
export { extractItems };
//# sourceMappingURL=extractItems.js.map