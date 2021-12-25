const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? false : 'eval-cheap-module-source-map',
  entry: {
    'compac-novel-viewer': [
      path.join(__dirname, 'global.css'),
      path.join(__dirname, 'src', 'style.css'),
      path.join(__dirname, 'src', 'index.ts')
    ]
  },
  output: {
    path: path.join(__dirname, '..', '..', 'components', 'ReaderBrowser'),
    library: 'CompacNovelViewer',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.join(__dirname, 'dist')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-typescript']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ]
      },
      {
        test: /\.(png|gif|jpg|woff2?)$/,
        type: 'asset/inline'
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
      inject: 'head',
      scriptLoading: 'blocking'
    }),
    new HtmlInlineScriptPlugin()
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    }
  }
};
