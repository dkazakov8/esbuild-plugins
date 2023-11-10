import fs from 'fs';

import { Plugin } from 'esbuild';

type TypeParams = {
  ext: string;
  linkType: string;
  templatePath: string;
  replaceString: string;
};

export const pluginInjectPreload = (params: TypeParams): Plugin => ({
  name: 'esbuild-plugin-inject-preload',
  setup(build) {
    build.onEnd((result) => {
      let template = fs.readFileSync(params.templatePath, 'utf-8');
      const outputs = Object.keys(result.metafile!.outputs);
      const outDir = (build.initialOptions.outdir || '').split('/').pop();

      template = template.replace(
        params.replaceString,
        outputs
          .filter((str) => str.endsWith(params.ext))
          .map((str) => str.replace(new RegExp(`${outDir}/?`), ''))
          .map(
            (str) =>
              `<link as="${params.linkType}" crossorigin="anonymous" href="/${str}" rel="preload">`
          )
          .join('\n')
      );

      fs.writeFileSync(params.templatePath, template, 'utf-8');

      return Promise.resolve();
    });
  },
});
