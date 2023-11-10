import fs from 'fs';

import { Plugin } from 'esbuild';
import { Options as SWCOptions, transform } from '@swc/core';

export function pluginSwc(options: SWCOptions = {}): Plugin {
  return {
    name: 'esbuild-plugin-swc2',
    setup(build) {
      const cache: Record<string, string> = {};

      build.onLoad({ filter: /\.([tj]sx?)$/ }, (args) => {
        if (args.path.includes('node_modules')) {
          if (args.path.includes('core-js')) return { loader: 'js' };

          if (cache[args.path]) {
            return { contents: cache[args.path], loader: 'js' };
          }
        }

        return transform(fs.readFileSync(args.path, 'utf-8'), {
          filename: args.path,
          sourceMaps: false,
          ...options,
        }).then(({ code }) => {
          if (args.path.includes('node_modules')) {
            cache[args.path] = code;
          }

          return { contents: code, loader: 'js' };
        });
      });
    },
  };
}
