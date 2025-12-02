import { Node as DomHandlerNode } from 'domhandler';
import type { AnyNode as DomHandlerAny } from 'domhandler';
import type { DomSerializerOptions } from 'dom-serializer';
export declare class HTML {
    static getOuter(node: DomHandlerAny | ArrayLike<DomHandlerAny>, options: DomSerializerOptions): string;
    static getInner(node: DomHandlerAny, options: DomSerializerOptions): string;
    static hasChildren(node: DomHandlerNode): node is import("domhandler").ParentNode;
}
