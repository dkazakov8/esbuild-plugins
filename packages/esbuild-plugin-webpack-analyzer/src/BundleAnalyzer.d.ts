declare module 'webpack-bundle-analyzer' {
  export const start: (
    stats: {
      assets: Array<{ name: string; chunks: Array<string> }>;
      modules: Array<{
        id: string;
        name: string;
        size: number;
        chunks: Array<string>;
      }>;
    },
    options: {
      analyzerUrl: (params: { listenHost: string; boundAddress: { port: number } }) => string;
      port: number;
      host: string;
      openBrowser: boolean;
    }
  ) => Promise<{ updateChartData: (params: any) => void }>;
}
