const path = require('path')

const RootPath = path.resolve(__dirname, '../')
const ESLintPlugin = require('eslint-webpack-plugin')

const providePlugin = {
    webConfig: ['@/src/web.config.js', 'default'],
    API: ['@/src/api/api.js', 'default'],
    PropTypes: ['prop-types'],
    Invoke: ['@/src/api/invoke.js', 'default'],
    React: ['react'],
    connect: ['react-redux', 'connect'],
}

const baseConfig = {
    module: {
        rules: [
            {
                test: /\.(png|jpeg|jpg|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: `images/[name]${'-[hash:6]'}.[ext]`,
                        esModule: false,
                    },
                },
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-sprite-loader',
                    },
                    {
                        loader: 'svgo-loader',
                        options: {
                            plugins: [
                                'preset-default', // 这个不会删除属性
                            ],
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.css', '.ts', '.tsx'],
        modules: ['node_modules'],
        alias: {
            '@': RootPath,
            client: path.resolve(RootPath, 'src/client'),
            canvas: false,
            encoding: false,
        },
    },
}

const eSLintPluginConfig = {
    plugins: [
        new ESLintPlugin({
            context: '../',
            threads: true,
            emitError: true,
            emitWarning: false,
            failOnError: true,
            extensions: ['ts', 'tsx', 'js', 'jsx'],
        }),
    ],
}

module.exports = { providePlugin, baseConfig, eSLintPluginConfig }
