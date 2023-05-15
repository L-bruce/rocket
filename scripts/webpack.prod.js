const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const WebpackBar = require('webpackbar')
const Glob = require('glob')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const postcss = require('postcss-import')
const { providePlugin, baseConfig } = require('./webpack.base')
const utils = require('./webpack.utils.js')

const RootPath = path.resolve(__dirname, '../')
const EntryPath = path.resolve(RootPath, './src/template')
const PagesPath = path.resolve(RootPath, './src/client')
const serverName = utils.getServerName()
const appVersion = utils.getBuildVersion()
const buildPath = utils.getBuildPath(process.env.BUILD_ENV, serverName)
const isProduction = process.env.BUILD_ENV == 'PRO'

console.log('-----打包客户端资源-----', process.env.BUILD_ENV, isProduction)
console.log(
    JSON.stringify(
        {
            'process.env.npm_config_argv': JSON.parse(process.env.npm_config_argv),
            serverName,
            buildPath,
            output: path.resolve(__dirname, buildPath),
        },
        null,
        4
    )
)

const plugins = [
    new WebpackBar({
        name: '客户端打包',
        color: '#1fd08a',
    }),
    new CleanWebpackPlugin({
        verbose: true,
    }),
    new webpack.ProvidePlugin({ ...providePlugin, process: 'process/browser', magpie: ['magpie-monitor'] }),
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
        chunkFilename: 'css/[name]-[contenthash:6].css',
        ignoreOrder: true,
    }),

    new ForkTsCheckerWebpackPlugin(),
]

// 获取目录下所有入口js
const filenames = Glob.sync(path.resolve(PagesPath, '**/*.js'))

const entryObj = filenames.reduce(function (all, filename) {
    const name = path.basename(filename, path.extname(filename))

    all[name] = filename

    const htmlPlugin = new HtmlWebpackPlugin({
        filename: `html/index.html`,
        template: path.resolve(EntryPath, `./index.html`),
        favicon: path.resolve(EntryPath, './favicon.ico'),
        chunks: ['runtime', 'libs', 'common', name],
        title: 'react-demo',
        inject: false,
        hash: false,
        minify: {
            removeComments: true, // 移除HTML中的注释
            collapseWhitespace: true, // 删除空白符与换行符
            minifyCSS: true, // 压缩内联css
            minifyJS: true, // 压缩内联js
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
    })

    plugins.push(htmlPlugin)

    return all
}, {})

console.log('entryObj', entryObj)

let publicPath = ''

if (serverName == 'prod') {
    if (appVersion != 'unknown') {
        publicPath = '/'
    } else {
        publicPath = '/'
    }
} else {
    publicPath = '/'
}

const clientConfig = {
    entry: entryObj,
    mode: 'production',
    devtool: 'hidden-source-map',
    performance: {
        hints: false,
    },
    output: {
        publicPath, // 可以配置cdn主机头
        filename: 'js/[name]-[contenthash:6].js',
        chunkFilename: 'js/[name]-[contenthash:6].js',
        path: path.resolve(__dirname, buildPath),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [],
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
                    {
                        loader: 'css-loader',
                    },
                    'postcss-loader',
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: {
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
        moduleIds: 'deterministic', // 生成稳定的moduleId
        runtimeChunk: {
            name: 'runtime',
        },
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                extractComments: false, // 是否将注释剥离到单独的文件中
                terserOptions: {
                    compress: {
                        drop_console: isProduction,
                        drop_debugger: true,
                    },
                },
            }),
            new CssMinimizerPlugin(), // 压缩css使用，node版本需要14以上，先注释
        ],
        splitChunks: {
            chunks: 'all',
            maxAsyncRequests: 6,
            maxInitialRequests: 6,
            automaticNameDelimiter: '-',
            cacheGroups: {
                libs: {
                    chunks: 'all',
                    name: 'libs',
                    test: utils.getPathRegexp(['react', 'react-dom', 'react-router-dom']),
                    priority: 100,
                },
                common: {
                    chunks: 'all',
                    name: 'common',
                    minChunks: 2,
                    priority: 40,
                },
                vendors: false,
                default: false,
            },
        },
    },
    plugins,
}

module.exports = merge(baseConfig, clientConfig)
