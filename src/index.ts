import { plugin } from './plugin.js';
import { Mode } from './mdTransform.js';

import type { PluginOptions, MdCompilerFunc } from './plugin.js';
import type { TocItem, TagItem } from './extractItems.js';

export default plugin;
export { plugin, Mode };
export type { PluginOptions, MdCompilerFunc, TocItem, TagItem };
