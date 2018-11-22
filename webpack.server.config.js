const 
    webpack = require('webpack'),
    fs = require('fs'),
    path = require('path'),
    nodeExternals = require('webpack-node-externals');

// console.log('path -> ', path.resolve( __dirname, './' ));

module.exports = {
    context: path.resolve( __dirname, './' ),
    mode: 'production',
    entry: {
        main: './server/index.js'
    },
    output: {
        filename: './app.js',
        path: path.resolve(__dirname, './')
    },
    target: 'node',
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            { test: /\.css$/, loader: 'ignore-loader' }
        ]
    }
};