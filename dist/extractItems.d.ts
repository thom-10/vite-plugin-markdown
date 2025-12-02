import type { ChildNode as DomHandlerChild } from 'domhandler';
/**
 * Represents parsed headings of markdown
 */
interface TocItem {
    /** toc level number */
    level: number;
    /** text-content or additional items */
    content: string;
}
/**
 * Represents parsed entries of markdown
 */
interface TagItem {
    /** html tag */
    tag: string;
    /** text-content or additional items */
    content: string | TagItem[];
}
type MdItem<T extends boolean> = T extends true ? TocItem : TagItem;
declare function extractItems<T extends boolean>(nodes: DomHandlerChild[], filter: string[], toc: T): MdItem<T>[];
export { extractItems };
export type { TocItem, TagItem, MdItem };
