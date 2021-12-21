var path = require('path');
var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

var paths = (function () {
    var rootPath = path.join(__dirname, './');
    return {
        root: rootPath,
        nodeModules: path.join(rootPath, './node_modules/'),
        src: path.join(rootPath, './src'),
        output: path.join(rootPath, './_build')
    };
})();

module.exports = {
    entry: {
        bundle: [
            path.join(paths.nodeModules, '/normalize.css/normalize.css'),
            path.join(paths.src, '/index.js')
        ]
    },
    output: {
        path: paths.output,
        filename: '[name].js',
        publicPath: "",
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.s?[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
            {
                test: /\.(woff2?)(\?[a-z0-9=&.]+)?$/,
                use: {
                    loader: 'base64-inline-loader',
                    options: {
                        limit: 10000000,
                    }
                }
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            scriptLoading: 'blocking',
            template: "./index.html",
            inject: "head"
        }),
        new HtmlInlineScriptPlugin(),
    ]
};
