import path from 'path';
import fs from 'fs';

import { Loader, Plugin } from 'esbuild';

const replacePattern: [RegExp, (...args: any) => any] = [
  /\n(export default |export )?class ([a-zA-Z0-9]+)(.*?)?extends ConnectedComponent(.*?(?=}\n}))}\n}/gs,
  // eslint-disable-next-line max-params
  function replacer(
    match: string,
    exportStatement: string,
    className: string,
    types: string,
    classContent: string
  ) {
    const wrappedComponent = `ConnectedComponent.observer(class ${className} extends ConnectedComponent${classContent}}\n});`;

    let str = '\n';

    if (exportStatement) str += exportStatement;

    if (!exportStatement || !exportStatement.includes('default')) {
      str += `const ${className} = ${wrappedComponent}`;
    } else {
      str += wrappedComponent;
    }

    return str;
  },
];

export const pluginReplace = ({
  filter = /.*/,
  loader = 'tsx',
  encoding = 'utf-8',
  patterns = [replacePattern],
  rootDir = process.cwd(),
}: {
  rootDir?: string;
  filter?: RegExp;
  loader?: Loader;
  encoding?: BufferEncoding;
  patterns?: Array<[RegExp, (...args: any) => any]>;
} = {}): Plugin => ({
  name: 'esbuild-plugin-replace-regex',
  setup(build) {
    const rootDirDefined = rootDir || process.cwd();
    const isWindows = process.platform.startsWith('win');
    const esc = (p: string) => (isWindows ? p.replace(/\\/g, '/') : p);

    build.onLoad({ filter }, (args) => {
      return fs.promises.readFile(args.path, encoding).then((content) => {
        let contents = content;

        patterns.forEach(([regex, replacer]) => {
          contents = contents.replace(regex, replacer);
        });

        contents = contents
          .replace(/__dirname/g, `"${esc(path.relative(rootDirDefined, path.dirname(args.path)))}"`)
          .replace(/__filename/g, `"${esc(path.relative(rootDirDefined, args.path))}"`);

        return {
          contents,
          loader,
        };
      });
    });
  },
});
