import renderHTML from 'dom-serializer';
import { Node as DomHandlerNode, hasChildren } from 'domhandler';

import type {
    AnyNode as DomHandlerAny,
    ChildNode as DomHandlerChild,
} from 'domhandler';
import type { DomSerializerOptions } from 'dom-serializer';

export class HTML {
    static getOuter(
        node: DomHandlerAny | ArrayLike<DomHandlerAny>,
        options: DomSerializerOptions
    ) {
        return renderHTML(node, options);
    }

    static getInner(node: DomHandlerAny, options: DomSerializerOptions) {
        return node instanceof DomHandlerNode && this.hasChildren(node)
            ? node.children
                  .map((node: DomHandlerChild) => this.getOuter(node, options))
                  .join('')
            : '';
    }

    static hasChildren(node: DomHandlerNode) {
        return hasChildren(node);
    }
}
