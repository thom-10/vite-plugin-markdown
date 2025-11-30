# vite-plugin-markdown

A plugin enables you to import a Markdown file as various formats on your [vite](https://github.com/vitejs/vite) project.

## Fork-Info

- This is a fork of [hmsk/vite-plugin-markdown](https://github.com/hmsk/vite-plugin-markdown). (The 3.0 beta, to be precice)
- It has some updated dependencies and replaces some deprecated methods.
- The typescript source can be imported directly
- There is NO npm-package of this version yet!
- Main reason for the fork is the addition of `MODE.CONTENT`. With this you get an Array similar to `MODE.TOC`, but with all items, and the content can be another array of items (e.g. list-elements).
- see exported type `MdItem`

## Setup

```
npm i -D thom-10/vite-plugin-markdown
pnpm add -D thom-10/vite-plugin-markdown
```

### Config

```js
import mdPlugin from 'vite-plugin-markdown';

module.exports = {
    plugins: [mdPlugin(options)],
};
```

#### Alternative: Import the typescript source directly:

```ts
import mdPlugin from 'vite-plugin-markdown/ts';

module.exports = {
    plugins: [mdPlugin(options)],
};
```

Then you can import front matter attributes from `.md` file as default.

```md
---
title: Awesome Title
description: Describe this awesome content
tags:
    - 'great'
    - 'awesome'
    - 'rad'
---

# This is awesome

Vite is an opinionated web dev build tool that serves your code via native ES Module imports during dev and bundles it with Rollup for production.
```

```ts
import { attributes } from './contents/the-doc.md';

console.log(attributes); //=> { title: 'Awesome Title', description: 'Describe this awesome content', tags: ['great', 'awesome', 'rad'] }
```

### Options

```ts
mode?: ('html' | 'toc' | 'content' | 'react' | 'vue')[]
markdown?: (body: string) => string // If you want to use your own markdown compiler (used only if markdonIt not set)
markdownIt?: MarkdownIt | MarkdownIt.Options // If you want to use your own config of Markdown-It instead of the internal
```

Enum for `mode` is provided as `Mode`

```ts
import { Mode } from 'vite-plugin-markdown';

console.log(Mode.TOC); //=> 'toc'
console.log(Mode.CONTENT); //=> 'content'
console.log(Mode.HTML); //=> 'html'
console.log(Mode.REACT); //=> 'react'
console.log(Mode.VUE); //=> 'vue'
```

"Mode" enables you to import markdown file in various formats (HTML, ToC, React/Vue Component)

#### `Mode.MARKDOWN (default)`

thom-10: As the markdown data has to be read in any case. I removed the Mode-option for it. It is alway exported. Just leave it unused, if you don't need it

<details>
  <summary>Import the raw Markdown content</summary>

```js
import { markdown } from './contents/the-doc.md';
```

result

```md
# This is awesome

Vite is an opinionated web dev build tool that serves your code via native ES Module imports during dev and bundles it with Rollup for production.
```

</details>

#### `Mode.HTML`

<details>
  <summary>Import compiled HTML</summary>

```md
# This is awesome

Vite is an opinionated web dev build tool that serves your code via native ES Module imports during dev and bundles it with Rollup for production.
```

```ts
import { html } from './contents/the-doc.md';

console.log(html); //=> "<h1>This is awesome</h1><p>ite is an opinionated web dev build tool that serves your code via native ES Module imports during dev and bundles it with Rollup for production.</p>"
```

</details>

#### `Mode.TOC`

<details>
  <summary>Import ToC metadata</summary>

```md
# vite

Vite is an opinionated web dev build tool that serves your code via native ES Module imports during dev and bundles it with Rollup for production.

## Status

## Getting Started

# Notes
```

import

```ts
import { toc } from './contents/the-doc.md';
```

result

```json
[
    { "level": 1, "content": "vite" },
    { "level": 2, "content": "Status" },
    { "level": 2, "content": "Getting Started" },
    { "level": 1, "content": "Notes" }
]
```

</details>

#### `Mode.CONTENT`

<details>
  <summary>Import content data</summary>

Similar to Mode.TOC but includes all tags. Not just the headings.  
content-value could be array. (e.g. with li-tags)

```md
# vite

Vite is an opinionated web dev build tool that serves your code via native ES Module imports during dev and bundles it with Rollup for production.

## Status

- great
- awesome
- rad

## Getting Started

# Notes
```

import

```ts
import { content } from './contents/the-doc.md';
```

result

```json
[
    { "tag": "h1", "content": "vite" },
    { "tag": "h2", "content": "Status" },
    { "tag": "ul", "content": [
      { "tag": "li", "content": "great" },
      { "tag": "li", "content": "awesome" },
      { "tag": "li", "content": "rad" },
    ]}
    { "tag": "h2", "content": "Getting Started" },
    { "tag": "h1", "content": "Notes" }
]
```

</details>

#### `Mode.REACT`

<details>
  <summary>Import as a React component</summary>

```jsx
import React from 'react'
import { ReactComponent } from './contents/the-doc.md'

function MyReactApp() {
  return (
    <div>
      <ReactComponent />
    </div>
}
```

<details>
<summary>Custom Element on a markdown file can be runnable as a React component as well</summary>

```md
# This is awesome

Vite is <MyComponent type={'react'}>
```

```jsx
import React from 'react'
import { ReactComponent } from './contents/the-doc.md'
import { MyComponent } from './my-component'

function MyReactApp() {
  return (
    <div>
      <ReactComponent MyComponent={MyComponent} />
    </div>
}
```

`MyComponent` on markdown perform as a React component.

</details>
</details>

#### `Mode.VUE`

<details>
  <summary>Import as a Vue component</summary>

```vue
<template>
    <article>
        <markdown-content />
    </article>
</template>

<script>
import { VueComponent } from './contents/the-doc.md';

export default {
    components: {
        MarkdownContent: VueComponent,
    },
};
</script>
```

<details>
<summary>Custom Element on a markdown file can be runnable as a Vue component as well</summary>

```md
# This is awesome

Vite is <MyComponent :type="'vue'">
```

```vue
<template>
    <article>
        <markdown-content />
    </article>
</template>

<script>
import { VueComponentWith } from './contents/the-doc.md';
import MyComponent from './my-component.vue';

export default {
    components: {
        MarkdownContent: VueComponentWith({ MyComponent }),
    },
};
</script>
```

`MyComponent` on markdown perform as a Vue component.

</details>
</details>

### Type declarations

In TypeScript project, need to declare typedefs for `.md` file as you need.

```ts
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

    // When "Mode.React" is requested. VFC could take a generic like React.VFC<{ MyComponent: TypeOfMyComponent }>
    import type React from 'react';
    const ReactComponent: React.VFC;

    // When "Mode.Vue" is requested
    import type { ComponentOptions, Component } from 'vue';
    const VueComponent: ComponentOptions;
    const VueComponentWith: (
        components: Record<string, Component>
    ) => ComponentOptions;

    // Modify below per your usage
    export {
        attributes,
        markdown,
        toc,
        content,
        html,
        ReactComponent,
        VueComponent,
        VueComponentWith,
    };
}
```

Save as `vite.d.ts` for instance.

## License

MIT
