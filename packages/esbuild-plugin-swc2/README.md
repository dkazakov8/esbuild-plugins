## esbuild-plugin-swc2

[![npm](https://img.shields.io/npm/v/esbuild-plugin-swc2)](https://www.npmjs.com/package/esbuild-plugin-swc2)
[![license](https://img.shields.io/npm/l/esbuild-plugin-swc2)](https://github.com/dkazakov8/esbuild-plugins/tree/master/packages/esbuild-plugin-replace/LICENSE)

Allows parsing of JS and TS files by SWC.

### Usage

```typescript
import { BuildOptions } from 'esbuild';
import { pluginSwc } from 'esbuild-plugin-swc2';

const list = JSON.parse(fs.readFileSync('package.json', 'utf-8')).browserslist;

const esbuildConfig: BuildOptions = {
  plugins: [
    pluginSwc({
      jsc: {
        parser: { tsx: true, syntax: 'typescript' },
        transform: {
          react: { runtime: 'automatic', useBuiltins: false },
        },
      },
      env: { mode: 'usage', targets: list },
    }),
  ],
};
```

### Features

- works much faster than 'esbuild-plugin-swc'
- supports env mode 'usage' so auto-polyfills work
