import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import TSConfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import type { Configuration } from 'webpack'
import type { TSLoaderType } from '../loader-for-ts'
import { getTSLoader } from '../loader-for-ts'
import { getCommonConfig } from '../webpack.common.config'
import { devServerConfig } from '../webpack.dev-server.config'

const context = process.cwd()
const isDevelopment = process.env.NODE_ENV !== 'production'
const loaderForTS = getTSLoader({
  type: process.env.LOADER as TSLoaderType,
  isDevelopment
})

const commonConfig = getCommonConfig({ name: 'webpack-workspace-example' })

const config: Configuration = {
  ...commonConfig,
  devServer: devServerConfig,
  context,
  entry: 'src/index',
  output: {
    path: context + '/dist',
    filename: '[name].js'
  },
  module: {
    rules: [...loaderForTS.module.rules]
  },
  resolve: {
    ...commonConfig.resolve,
    modules: ['node_modules', path.resolve(__dirname)],
    plugins: [
      new TSConfigPathsPlugin({
        logLevel: 'INFO',
        mainFields: ['module', 'main'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
      })
    ]
  },
  plugins: [
    ...commonConfig.plugins,
    ...loaderForTS.plugins,
    new HtmlWebpackPlugin({
      templateContent: `
        <html>
          <body>
            <h1>workspace webpack example</h1>
            <div id="react-content"></div>
          </body>
        </html>
      `
    })
  ].filter(Boolean)
}

export default config
