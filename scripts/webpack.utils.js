const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const postcssImport = require('postcss-import')
const pkg = require('../package.json')

const isDevelopment = process.env.NODE_ENV == 'development'
const RootPath = path.resolve(__dirname, '../')

/**
 * 获取用于生成Dll library的库
 *
 * @param { array } exclude 需要排除的库
 * @returns array
 */
const getDllLibs = exclude => {
    let libs = Object.keys(pkg.dependencies || {})

    if (exclude && exclude.length > 0) {
        libs = libs.filter(item => {
            return exclude.indexOf(item) == -1
        })
    }

    return libs
}

/**
 * 获取正则表达式（添加@符，是为了兼容cnpm，cnpm路径是/node_modules/_react@16.9.0@react/index.js类似这样子）
 *
 * @param { array } arr ["antd", "@ant-design"]
 * @returns array [\\/@]antd[\\/]|[\\/@]@ant-design[\\/]
 */
const getPathRegexp = arr => {
    const str = arr
        .map(item => {
            return `[\\\\/@]${item}[\\\\/]`
        })
        .join('|')

    return new RegExp(str)
}

// 获取服务器名称
const getServerName = function () {
    let serverName = ''

    if (process.env.npm_config_argv) {
        const npmConfigArgv = JSON.parse(process.env.npm_config_argv)

        serverName = npmConfigArgv.original[2] || npmConfigArgv.original[1]
        console.log('当前的serverName：', serverName)
        if (serverName) {
            serverName = serverName.replace('--', '')

            // 如果存在buildversion，说明是打包生成环境
            if (serverName.indexOf('buildversion') != -1) {
                serverName = 'prod'
            }
        }
    }

    console.log('serverName：', serverName)

    return serverName
}

// 获取打包版本号
const getBuildVersion = function () {
    let buildVersion = 'unknown'

    if (process.env.npm_config_buildversion) {
        buildVersion = process.env.npm_config_buildversion
    }

    return buildVersion
}

// 获取打包路径
const getBuildPath = function (env, serverName) {
    switch (env) {
        case 'TEST':
            return path.resolve(RootPath, `./dist/${serverName}`)
        case 'PRE':
            return path.resolve(RootPath, `./dist/${serverName}`)
        case 'PRO':
            return path.resolve(RootPath, `./dist/prod`)
        case 'DEV':
            return path.resolve(RootPath, `./dist/dev`)
        default:
            return path.resolve(RootPath, `./build`)
    }
}

const getStyleUseRules = function (local) {
    return [
        {
            loader: MiniCssExtractPlugin.loaders,
        },
        {
            loader: 'css-loader',
            options: {
                sourceMap: isDevelopment,
                importLoaders: 2,
                modules: local,
                localIdentName: '[local]_[hash:base64:5]',
            },
        },
        {
            loader: 'postcss-loader',
            options: {
                sourceMap: true,
                parser: 'postcss-scss',
                plugins: [postcssImport],
            },
        },
    ]
}

const getStyleUseRulesByNew = function (local) {
    return [
        {
            test: /\.css/,
            use: [
                'style-loader',
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
                {
                    loader: MiniCssExtractPlugin.loader,
                },
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: isDevelopment,
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
                        plugins: [require('postcss-import')],
                    },
                },
                'sass-loader',
            ],
        },
    ]
}

module.exports = {
    getDllLibs,
    getPathRegexp,
    getBuildPath,
    getServerName,
    getBuildVersion,
    getStyleUseRules,
    getStyleUseRulesByNew,
}
