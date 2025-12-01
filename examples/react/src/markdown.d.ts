declare module '*.md' {
    /*  
      typing of this can be replaced with whatever the structure of your metadata is
      for example: { title: string; description: string; keywords?: string[] } 
    */
    const attributes: Record<string, unknown>;

    // Always exported
    const markdown: string;

    /*  
      When "Mode.TOC" is requested
      TocItem { level: number, content: string }
    */
    const toc: import('vite-plugin-markdown').TocItem[];

    /*  
      When "Mode.CONTENT" is requested
      TagItem { tag: string, content: string | TagItem[] }
    */
    const content: import('vite-plugin-markdown').TagItem[];

    // When "Mode.HTML" is requested
    const html: string;

    interface RcProps {
      LinkToRepository: import('react').ElementType
    }

    // When "Mode.React" is requested. 
    // FC could take a generic like React.FC<{ MyComponent: TypeOfMyComponent }>
    import type React from 'react';
    const ReactComponent: React.FC<RcProps>;


    // Modify below per your usage
    export {
        attributes,
        markdown,
        toc,
        content,
        html,
        ReactComponent,
    };
}