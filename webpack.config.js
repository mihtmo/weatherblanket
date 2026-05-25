const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
require('dotenv').config();
const webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'public/'),
        filename: 'index_bundle.js',
    },
    target: 'web',
    devServer: {
        port: '3000',
        static: {
            directory: path.join(__dirname, 'public'),
        },
        open: true,
        hot: true,
        liveReload: false,
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html'), // <-- move template to src/
        }),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(
                Object.keys(process.env)
                    .filter((key) => key.startsWith('REACT_APP_'))
                    .reduce((env, key) => {
                        env[key] = process.env[key];
                        return env;
                    }, {}),
            ),
        }),
    ],
};
