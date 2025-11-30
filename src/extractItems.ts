import { Element as DomHandlerElement } from 'domhandler';
import { textContent } from 'domutils';

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

function extractItems<T extends boolean>(
    nodes: DomHandlerChild[],
    filter: string[],
    toc: T
): MdItem<T>[] {
    const indicies = nodes.filter(
        (rootSibling) =>
            rootSibling instanceof DomHandlerElement &&
            (filter.length === 0 || filter.includes(rootSibling.tagName))
    ) as DomHandlerElement[];

    const recureNodes = ['ul', 'ol', 'blockquote'];

    return indicies.map<MdItem<T>>((index): MdItem<T> => {
        const { tagName } = index;

        if (toc) {
            const contentValue = textContent(index);
            return {
                level: Number(tagName.replace('h', '')),
                content: contentValue,
            } as MdItem<T>;
        }

        const contentValue = recureNodes.includes(tagName)
            ? extractItems(index.childNodes, filter, false)
            : textContent(index);
        return {
            tag: tagName,
            content: contentValue,
        } as MdItem<T>;
    });
}

export { extractItems };
export type { TocItem, TagItem, MdItem };
