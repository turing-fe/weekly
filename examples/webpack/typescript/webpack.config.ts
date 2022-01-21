import path from 'path'
// import ForkTSCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
// import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import type { Configuration as WebpackConfiguration } from 'webpack'
import type { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
import { getTSLoader } from '../ts-loader'
import { commonConfig } from '../webpack.common.config'
import { devServerConfig } from '../webpack.dev-server.config'

const LOADER = (process.env.LOADER as 'babel' | 'ts' | 'swc') || 'babel'
const loaderForTS = getTSLoader(LOADER, false)

const config: WebpackConfiguration & {
  devServer: WebpackDevServerConfiguration
} = {
  ...commonConfig,
  // target: 'web',
  // 可通过 webpack --mode development 传入
  // mode: 'development',
  /**
   * 可以是字符串/数组/对象，如果是数组则默认会合并为 main
   * @relativePath
   * @optional
   * @default src/index.js，如果 resolve: { extensions: ['.ts', '.js', '.json']} 中指定了 ts 等其它后缀也会去寻找
   * @attention 需要后缀名，如果是对象则会默认按 key 有多个输出
   * @example
   *   entry: './src/index.ts',
   *   entry: ['./src/index.ts', './src/render.ts'],
   *   entry: {
         main: './src/index.ts',
         render: './src/index.ts'
       },
   */
  entry: {
    main: './src/index.ts'
  },
  output: {
    /**
     * @optional
     * @default dist
     */
    path: path.resolve(__dirname, 'dist'),
    /**
     * @optional
     * @default entry 为对象时的 key name 或者 main.js
     * @example
     */
    filename: 'bundle.js'
  },
  module: {
    rules: [...loaderForTS.module.rules]
  },
  plugins: [
    ...loaderForTS.plugins,
    /**
     * 如果使用了此插件，则会使用 output.path 中的 html
     * @see [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)
     * @example
     *   new HtmlWebpackPlugin() 自动在 output.path 中输出一个 index.html
     */
    new HtmlWebpackPlugin({
      template: './template.html',
      /**
       * @default true，在 head 中
       */
      inject: 'body'
    })
  ],
  devServer: devServerConfig
}

export default config