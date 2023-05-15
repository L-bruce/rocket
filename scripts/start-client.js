/* eslint-disable import/no-extraneous-dependencies */
const chalk = require('chalk')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const { clientPort } = require('./port')

let compilationTime = 0 // 编译次数

// webapck dev 前端构建环境配置
const clientConfig = require('./webpack.client')

// 创建 wds 服务
function createWdsServer() {
    const compiler = webpack(clientConfig)

    compiler.hooks.done.tap('done', function () {
        if (compilationTime === 0) {
            // 第一次编译完成的时，自动打开浏览器
            console.log(chalk.red(`客户端编译完成，请通过 http://localhost:${clientPort} 访问`))
            process.send('CLIENTCODECOMPLETED')
        } else {
            console.log(chalk.cyan('客户端编译完成'))
        }
        compilationTime += 1
    })

    const devServerOptions = { ...clientConfig.devServer, open: false }

    return new WebpackDevServer(devServerOptions, compiler)
}

// 启动 WebpackDevServer.
function runWdsServer() {
    const devServer = createWdsServer()

    devServer.startCallback(() => {
        console.log(chalk.cyan('🚀 正在启动服务, 请稍后....\n'))
    })
}

runWdsServer()
