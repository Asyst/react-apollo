const 
    webpack = require('webpack'),
    path = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    DashboardPlugin = require('webpack-dashboard/plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin');
    // ReactLoadablePlugin = require('react-loadable/webpack').ReactLoadablePlugin;
    // HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: path.resolve( __dirname, './' ),
    entry: {
        main: './client/index.js'
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build/'),
        sourceMapFilename: 'bundle.map'
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            minChunks: 2,
            cacheGroups: {
                    vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    name: 'vendors',
                    chunks: 'all'
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () => require('autoprefixer')
                            }
                        }
                    ]
                })
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () => require('autoprefixer')
                            }
                        },
                        'sass-loader'
                    ]
                })
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            outputPath: 'assets/img/'
                        }  
                    }
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'url-loader?limit=100000&name=assets/fonts/[name].[ext]'
            },
            {
                test: /\.worker\.js$/,
                loader: 'worker-loader',
                options: { inline: true }
            }
        ]
    },
    node: {
        console: false,
        fs: false,
        net: false,
        tls: false
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                IS_BROWSER: "true"
            }
        }),
        new DashboardPlugin(),
        // new HtmlWebpackPlugin({
        //     filename: 'index.html',
        //     template: './public/index.html'
        // }),
        new ExtractTextPlugin('assets/css/bundle.css')
        // new ReactLoadablePlugin({
        //     filename: './build/react-loadable.json',
        // })
        // new OptimizeCss({
        //     assetNameRegExp: /\.optimize\.css$/g,
        //     cssProcessor: require('cssnano'),
        //     cssProcessorOptions: {
        //         discardComments: {removeAll: true}
        //     },
        //     canPrint: true    
        // })
    ],
    devtool: '#source-map',
    devServer: {
        contentBase: path.join(__dirname, 'app'),
        historyApiFallback: true,
        noInfo: true
    }
};