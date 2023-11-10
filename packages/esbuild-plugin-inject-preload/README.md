## esbuild-plugin-inject-preload

[![npm](https://img.shields.io/npm/v/esbuild-plugin-inject-preload)](https://www.npmjs.com/package/esbuild-plugin-inject-preload)
[![license](https://img.shields.io/npm/l/esbuild-plugin-inject-preload)](https://github.com/dkazakov8/esbuild-plugins/tree/master/packages/esbuild-plugin-replace/LICENSE)

Injects preload links to html template.

### Usage

```typescript
import { BuildOptions } from 'esbuild';
import { pluginInjectPreload } from 'esbuild-plugin-inject-preload';

const esbuildConfig: BuildOptions = {
  assetNames: '[ext]/[name]' | '[name]', // optional, this plugin supports nested folders
  outdir: path.resolve('build'), // required
  metafile: true, // required
  plugins: [
    pluginInjectPreload({ 
      ext: '.woff',
      linkType: 'font',
      templatePath: path.resolve('build/template.html'),
      replaceString: '<!-- FONT_PRELOAD -->',
    }),
  ],
};
```

You should place some string into you html like `<!-- FONT_PRELOAD -->` in the example. So, the output
html file will contain links to all files with a certain extension, like:

```html
<link as="font" crossorigin="anonymous" href="/woff/Roboto-Regular.woff" rel="preload">
<link as="font" crossorigin="anonymous" href="/woff/Roboto-Medium.woff" rel="preload">
```
