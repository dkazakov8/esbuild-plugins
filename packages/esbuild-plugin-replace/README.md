## dk-esbuild-plugin-replace

[![npm](https://img.shields.io/npm/v/dk-esbuild-plugin-replace)](https://www.npmjs.com/package/dk-esbuild-plugin-replace)
[![license](https://img.shields.io/npm/l/dk-esbuild-plugin-replace)](https://github.com/dkazakov8/dk-esbuild-plugin-replace/blob/master/LICENSE)

Replaces __dirname and __filename and wraps class components in MobX observer (only for my ecosystem).

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
