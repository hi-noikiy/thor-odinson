const path = require('path')
const webpack = require("webpack")
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = {
  target: 'web',
  mode: 'production',
  devtool: 'none',
  entry: [
    path.resolve(__dirname, 'src/bootstrap.tsx'),
  ],
  output: {
    filename: 'static/bundle.[hash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css', '.json'],
  },
  stats: "verbose",
  externals: {
    bmap: 'BMap',
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
          name: '[name]-[hash].[ext]',
          outputPath: 'static/',
          publicPath: '/static/',
          limit: 10000,
        },
      },
    ],
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/public/index.html'),
      filename: 'index.html',
      title: "母婴专场",
      minify: true,
    }),
    new webpack.DefinePlugin({
      'process.env': "window.__envs",
    }),
    new FaviconsWebpackPlugin({
      logo: path.resolve(__dirname, 'src/public/favicon.png'),
      prefix: "static/",
      background: "#fff",
      title: "母婴专场",
    }),
  ],
}
