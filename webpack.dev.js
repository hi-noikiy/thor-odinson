const path = require('path')
const webpack = require('webpack')
const HtmlPlugin = require('html-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')

module.exports = {
  target: 'web',
  mode: 'development',
  devtool: 'eval',
  entry: [
    path.resolve(__dirname, 'src/bootstrap.tsx'),
  ],
  output: {
    filename: 'static/index.js',
    path: path.resolve(__dirname, `./dist`),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css'],
  },
  externals: {
    bmap: 'Bmap',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
      {
        test: /\.(css|scss)$/,
        use: [
          'style-loader',
          { loader: 'css-loader' },
          'postcss-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'static/',
          publicPath: '/static/',
          limit: 10000,
        },
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new webpack.NamedModulesPlugin({}),
    new HtmlPlugin({
      template: path.resolve(__dirname, './src/public/index.html'),
      filename: 'index.html',
      title: '母婴专场',
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(require('./config')),
    })
  ],
  devServer: {
    host: "localhost",
    stats: "none",
    hot: true,
    inline: true,
    historyApiFallback: true,
    disableHostCheck: true,
  }
}
