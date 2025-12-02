import type { TransformResult } from 'rollup';
import type { MdCompilerFunc } from './plugin.js';
declare enum Mode {
    HTML = "html",
    TOC = "toc",
    CONTENT = "content",
    REACT = "react",
    VUE = "vue"
}
declare const mdTransform: (code: string, id: string, mode: Mode[], mdRender: MdCompilerFunc) => Promise<TransformResult>;
export { mdTransform, Mode };
