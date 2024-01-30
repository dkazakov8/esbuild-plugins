import path from 'path';
import fs from 'fs';

import { Loader, Plugin } from 'esbuild';

export const replacePattern: [RegExp, (...args: any) => any] = [
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

export const replacePatternFC: [RegExp, (...args: any) => any] = [
  /(export default |export )?function ([A-Z][a-zA-Z0-9]+)(.*?(?=;\n}\n));\n}\n/gs,
  // eslint-disable-next-line max-params
  function replacer(
    match: string,
    exportStatement: string,
    functionName: string,
    functionContent: string
  ) {
    const wrappedComponent = `transformers.observer(function ${functionName}${functionContent};\n})\n`;

    let str = "\nimport { transformers } from 'compSystem/transformers';\n";

    if (exportStatement) str += exportStatement;

    if (!exportStatement || !exportStatement.includes('default')) {
      str += `const ${functionName} = ${wrappedComponent}`;
    } else {
      str += wrappedComponent;
    }

    return str;
  },
];

export const pluginReplace = ({
  filter = /.*/,
  loader = 'tsx',
  rootDir = process.cwd(),
  sourceDir = process.cwd(),
}: {
  filter?: RegExp;
  loader?: Loader;
  rootDir?: string;
  sourceDir: string;
}): Plugin => ({
  name: 'dk-esbuild-plugin-replace',
  setup(build) {
    const rootDirDefined = rootDir || process.cwd();
    const isWindows = process.platform.startsWith('win');
    const esc = (p: string) => (isWindows ? p.replace(/\\/g, '/') : p);

    build.onLoad({ filter }, (args) => {
      const wrapComponents = args.path.startsWith(sourceDir);

      return fs.promises.readFile(args.path, 'utf-8').then((content) => {
        let contents = content
          .replace(/__dirname/g, `"${esc(path.relative(rootDirDefined, path.dirname(args.path)))}"`)
          .replace(/__filename/g, `"${esc(path.relative(rootDirDefined, args.path))}"`);

        if (wrapComponents) {
          contents = contents
            .replace(replacePattern[0], replacePattern[1])
            .replace(replacePatternFC[0], replacePatternFC[1]);
        }

        const lodashImportRegex =
          /import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)['"](?:(?:lodash\/?.*?))['"][\s]*?(?:;|$|)/g;

        const lodashImports = contents.match(lodashImportRegex);

        if (!lodashImports) return { loader, contents };

        const destructuredImportRegex = /\{\s?(((\w+),?\s?)+)\}/g;

        lodashImports.forEach((line) => {
          const destructuredImports = line.match(destructuredImportRegex);

          // For example:
          // import noop from 'lodash/noop';
          if (!destructuredImports) return;

          // For example:
          // import { noop, isEmpty, debounce as _debounce } from 'lodash';
          const importName = destructuredImports[0].replace(/[{}]/g, '').trim().split(', ');

          let result = '';

          importName.forEach((name) => {
            const previousResult = `${result ? `${result}\n` : ''}`;
            if (name.includes(' as ')) {
              const [realName, alias] = name.split(' as ');
              result = `${previousResult}import ${alias} from 'lodash/${realName}';`;
            } else {
              result = `${previousResult}import ${name} from 'lodash/${name}';`;
            }
          });

          contents = contents.replace(line, result);
        });

        return { contents, loader };
      });
    });
  },
});
