// 客户端开发使用配置文件
const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const WebpackBar = require('webpackbar')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const postcss = require('postcss-import')
const { providePlugin, baseConfig, eSLintPluginConfig } = require('./webpack.base')
const { clientPort } = require('./port')

const RootPath = path.resolve(__dirname, '../')
const EntryPath = path.resolve(RootPath, './src/template')
const chalk = require('chalk') // 为控制台输出的信息增加点色彩

console.log('编译客户端文件：webpack.client.js，以下是对应的环境变量：')

console.log(chalk.red('process.env'),process.env)

console.log(
    JSON.stringify(
        {
            NODE_ENV: process.env.NODE_ENV,
            BUILD_ENV: process.env.BUILD_ENV,
            npm_config_argv: JSON.parse(process.env.npm_config_argv),
        },
        null,
        4
    )
)

const clientConfig = {
    mode: process.env.NODE_ENV,
    devtool: 'source-map',
    entry: {
        main: './src/client/main.js',
    },
    output: {
        publicPath: `http://localhost:${clientPort}/`,
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
        path: path.resolve(__dirname, 'build/client'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                ],
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: 'ts-loader',
                    },
                ],
            },
            {
                test: /\.css/,
                use: [
                    MiniCssExtractPlugin.loader,
                    // {
                    //     loader: 'style-loader', // 开发使用style-loader替换MiniCssExtractPlugin，为了让css样式热更新生效，可能会存在闪屏问题，待验证
                    // },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    'postcss-loader',
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    // {
                    //     loader: MiniCssExtractPlugin.loader,
                    // },
                    {
                        loader: 'style-loader', // 开发使用style-loader替换MiniCssExtractPlugin，为了让scss样式热更新生效，可能会存在闪屏问题，待验证
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            importLoaders: 2,
                            modules: true,
                            localIdentName: '[local]_[hash:base64:5]',
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            parser: 'postcss-scss',
                            plugins: [postcss],
                        },
                    },
                    'sass-loader',
                ],
            },
        ],
    },

    optimization: {
        splitChunks: {
            chunks: 'all',
            automaticNameDelimiter: '-',
            cacheGroups: {
                vendors: {
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                },
                default: false,
            },
        },
    },

    devServer: {
        static: {
            directory: path.resolve(__dirname, 'static'),
            publicPath: '/',
        },
        client: {
            overlay: true,
        },
        allowedHosts: 'all',
        host: 'localhost',
        port: clientPort,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        historyApiFallback: {
            rewrites: [
                {
                    from: '/',
                    to: '/index.html',
                },
            ],
        },
        proxy: {
            '/api': {
                target: 'https://www.test1234.com/',
                changeOrigin: true,
                secure: false,
                pathRewrite: { '^/api': '' },
            },
        },
    },
    plugins: [
        new WebpackBar({
            name: '客户端开发',
            color: '#1fd08a',
            profile: true,
        }),
        new webpack.ProvidePlugin({ ...providePlugin, process: 'process/browser' }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                BUILD_ENV: JSON.stringify(process.env.BUILD_ENV),
                npm_config_argv: JSON.stringify(process.env.npm_config_argv),
                npm_config_buildversion: JSON.stringify(process.env.npm_config_buildversion),
            },
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name]-[contenthash:6].css',
            chunkFilename: 'css/[id]-[contenthash:6].css',
            ignoreOrder: true,
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(EntryPath, './index.html'),
            favicon: path.resolve(EntryPath, './favicon.ico'),
            title: 'react-demo',
            inject: false,
            hash: false,
            minify: {
                removeComments: false, // 移除 HTML 中的注释
                collapseWhitespace: false, // 删除空白符与换行符
                minifyCSS: false, // 压缩内联 css
            },
            templateParameters: (compilation, assets, assetTags, options) => {
                return {
                    compilation,
                    webpackConfig: compilation.options,
                    htmlWebpackPlugin: {
                        tags: assetTags,
                        files: assets,
                        options,
                    },
                    isProd: process.env.NODE_ENV == 'production' && process.env.BUILD_ENV == 'PRO',
                }
            },
        }),
        new ForkTsCheckerWebpackPlugin(),
    ],
    cache: {
        type: 'filesystem',
        // 可选配置
        buildDependencies: {
            config: [__filename], // 当构建依赖的config文件（通过 require 依赖）内容发生变化时，缓存失效
        },
        name: 'client', // 配置以name为隔离，创建不同的缓存文件，如生成PC或mobile不同的配置缓存
    },
}

module.exports = merge(baseConfig, eSLintPluginConfig, clientConfig)
