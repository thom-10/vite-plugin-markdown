import type { Options as MarkdownItOptions } from 'markdown-it';
import MarkdownIt from 'markdown-it';
import { Mode } from './mdTransform.js';
interface PluginOptions {
    mode?: Mode[];
    markdown?: (body: string) => string;
    markdownIt?: MarkdownIt | MarkdownItOptions;
}
type MdCompilerFunc = (body: string) => string;
declare const plugin: (options?: PluginOptions) => {
    name: string;
    enforce: "pre";
    transform(this: import("rollup").TransformPluginContext, code: string, id: string): Promise<import("rollup").TransformResult>;
};
export { plugin };
export type { MdCompilerFunc, PluginOptions };
