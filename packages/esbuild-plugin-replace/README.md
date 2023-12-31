## dk-esbuild-plugin-replace

[![npm](https://img.shields.io/npm/v/dk-esbuild-plugin-replace)](https://www.npmjs.com/package/dk-esbuild-plugin-replace)
[![license](https://img.shields.io/npm/l/dk-esbuild-plugin-replace)](https://github.com/dkazakov8/esbuild-plugins/tree/master/packages/esbuild-plugin-replace/LICENSE)

> [!WARNING]
> Only for my ecosystem

Replaces __dirname and __filename, wraps class components in MobX observer and handles lodash tree-shaking.

### Usage

```typescript
import { BuildOptions } from 'esbuild';
import { pluginReplace } from 'dk-esbuild-plugin-replace';

const esbuildConfig: BuildOptions = {
  plugins: [
    pluginReplace({ filter: /\.(tsx?)$/ }),
  ],
};
```
