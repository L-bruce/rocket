const { spawn } = require('child_process') // 用于创建子进程
const chalk = require('chalk') // 为控制台输出的信息增加点色彩
const freePort = require('./free-port')

console.log(chalk.red('服务正在启动中...'))

// 释放客户端端口
freePort(8080)

// node 服务进程
let clientWatchProcess = null

process.env.NODE_ENV = 'development'
process.env.BUILD_ENV = 'DEV'
console.log(chalk.red('process.env'), process.env.npm_config_argv)


clientWatchProcess = spawn('node', ['./scripts/start-client.js', '--color=always'], {
    stdio: [process.stdin, process.stdout, process.stderr, 'ipc'],
    shell: process.platform === 'win32',
    env: process.env,
})

// 杀掉子进程
const killChild = () => {
    clientWatchProcess && clientWatchProcess.kill()
}

// 主进程关闭退出子进程
process.on('close', code => {
    console.log(chalk.red('主进程关闭 main process close', code))
    killChild()
})

// 主进程关闭退出子进程
process.on('exit', code => {
    console.log(chalk.red('主进程退出 main process exit', code))
    killChild()
})

// 非正常退出情况
process.on('SIGINT', function () {
    console.log(chalk.red('SIGINT exit'))

    killChild()
})
