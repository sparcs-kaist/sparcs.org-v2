const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const nodeEnv = (process.env.NODE_ENV || 'development').trim();

const babelLoader = {
    loader: 'babel-loader',

    options: {
        presets: [
            ['@babel/preset-env', { targets: 'last 4 versions' }]
        ]
    }
};

const postcssLoader = {
    loader: 'postcss-loader',
    options: {
        sourceMap: true,
        plugins: [
            require('postcss-nested'),
            require('postcss-preset-env')({
                browsers: [
                    'last 4 versions'
                ],
                stage: 0
            })
        ]
    }
};

const styleLoader = nodeEnv !== 'production'
    ? 'vue-style-loader'
    : MiniCssExtractPlugin.loader;

const cssLoader = [
    styleLoader,
    {
        loader: 'css-loader',
        options: {
            importLoaders: 1
        }
    },
    postcssLoader
];

module.exports = {
    entry: {
        sparcshome: path.resolve(__dirname, 'app', 'index.js')
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
        filename: '[name].bundle.js'
    },

    mode: nodeEnv,

    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        'css': cssLoader,
                        'js': babelLoader
                    }
                }
            },

            {
                resourceQuery: /blockType=i18n/,
                type: 'javascript/auto',
                use: [
                    '@intlify/vue-i18n-loader',
                    'yaml-loader'
                ]
            },

            {
                test: /\.js$/,
                use: babelLoader,
                exclude: [/node_modules/]
            },

            {
                test: /\.css$/,
                use: cssLoader
            },

            {
                test: /\.svg$/,
                oneOf: [
                    {
                        resourceQuery: /inline/,
                        use: [
                            babelLoader,
                            {
                                loader: 'vue-svg-loader',
                                options: {
                                    svgo: false
                                }
                            }
                        ]
                    },

                    {
                        loader: 'file-loader',
                        options: {
                            name: 'files/[hash:8].[ext]'
                        }
                    }
                ]
            },

            {
                test: /\.(png|jpe?g|gif|woff2?|otf|ttf|eot)(\?|#.*)?$/,
                loader: 'file-loader',
                options: {
                    name: 'files/[hash:8].[ext]'
                }
            }
        ]
    },

    resolve: {
        mainFields: ['browser', 'module', 'style', 'main'],
        extensions: ['.svg', '.vue', '.js', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'app')
        }
    },

    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: nodeEnv
        }),
        new HtmlWebpackPlugin({
            template: './app/index.html',
            filename: './index.html'
        }),
        new MiniCssExtractPlugin({filename: '[name].bundle.css'}),
        new VueLoaderPlugin()
    ],

    devtool: '#eval-source-map',
    devServer: {
        hot: true,
        inline: true,

        proxy: {
            '/api': 'http://localhost:3000'
        },

        historyApiFallback: {
            index: '/dist/'
        }
    }
};

if(nodeEnv === 'production') {
    module.exports.devtool = '#source-map';
    module.exports.optimization = {
        minimize: true
    };
} else {
    module.exports.plugins.push(
        new webpack.HotModuleReplacementPlugin()
    );
}
