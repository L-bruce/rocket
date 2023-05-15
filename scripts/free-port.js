// mac linux 释放指定端口
const child_process = require('child_process')

module.exports = function (port) {
    if (process.platform && process.platform !== 'win32') {
        // mac linux等
        const args = process.argv.slice(2)

        const portArg = args && args[0]

        if (portArg && portArg.indexOf('--') > 0) {
            port = portArg.split('--')[1]
        }
        const order = `lsof -i :${port}`
        const exec = child_process.exec

        exec(order, (err, stdout) => {
            if (err) {
                // return console.log(`查看端口命令出错 ${err}`);
            }
            stdout.split('\n').forEach(line => {
                const p = line.trim().split(/\s+/)
                const address = p[1]

                if (address != undefined && address != 'PID') {
                    exec(`kill -9 ${address}`, err => {
                        if (err) {
                            return console.log('释放指定端口失败！！')
                        }
                        console.log('port kill')
                    })
                }
            })
        })
    }
}
