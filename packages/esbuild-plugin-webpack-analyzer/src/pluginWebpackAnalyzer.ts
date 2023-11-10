import { Metafile, Plugin } from 'esbuild';
import { start } from 'webpack-bundle-analyzer';

const getModules = ({
  inputs,
  outputs,
}: Metafile): Array<{
  id: string;
  name: string;
  size: number;
  chunks: Array<string>;
}> => {
  const chunksIndexed: Record<string, Set<string>> = {};

  Object.entries(outputs).forEach(([chunkName, chunk]) => {
    Object.keys(chunk.inputs).forEach((moduleName) => {
      chunksIndexed[moduleName] = chunksIndexed[moduleName] || new Set();
      chunksIndexed[moduleName].add(chunkName.split('/').pop()?.split('.').shift() || 'unknown');
    });
  });

  return Object.entries(inputs).map(([moduleName, obj]) => {
    const name = `../${moduleName
      .replace(/(.*)?\/node_modules\//, '/node_modules/')
      .replace(/^((\.)*\/)+/, '')}`;

    return {
      id: name,
      name,
      chunks: [...(chunksIndexed[moduleName] || [])],
      size: obj.bytes,
    };
  });
};

type TypeOptions = {
  host?: string;
  port?: number;
  open?: boolean;
};

export const pluginWebpackAnalyzer = (options: TypeOptions): Plugin => ({
  name: 'esbuild-plugin-webpack-analyzer',
  setup(build) {
    let updateChartData: ((params: any) => void) | undefined;

    build.onEnd((result) => {
      const metaFile = result.metafile!;
      const stats = {
        assets: [{ name: 'js/client.js', chunks: ['client'] }],
        modules: getModules(metaFile),
      };

      if (updateChartData) {
        updateChartData(stats);
        return Promise.resolve();
      }

      // https://github.com/webpack-contrib/webpack-bundle-analyzer
      return start(stats, {
        analyzerUrl: (params) => `http://${params.listenHost}:${params.boundAddress.port}`,
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        port: options.port || 8888,
        host: options.host || '127.0.0.1',
        openBrowser: options.open ?? true,
      }).then((res) => {
        updateChartData = res.updateChartData;
      });
    });
  },
});
