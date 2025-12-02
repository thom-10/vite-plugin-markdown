import renderHTML from 'dom-serializer';
import { Node as DomHandlerNode, hasChildren } from 'domhandler';
export class HTML {
    static getOuter(node, options) {
        return renderHTML(node, options);
    }
    static getInner(node, options) {
        return node instanceof DomHandlerNode && this.hasChildren(node)
            ? node.children
                .map((node) => this.getOuter(node, options))
                .join('')
            : '';
    }
    static hasChildren(node) {
        return hasChildren(node);
    }
}
//# sourceMappingURL=HTML.js.map