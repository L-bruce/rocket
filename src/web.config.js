const { clientPort } = require('../scripts/port')

// 获取编译版本号
const getBuildVersion = function () {
    let buildVersion = 'unknown'

    if (process.env.npm_config_buildversion) {
        buildVersion = process.env.npm_config_buildversion
    }

    return buildVersion
}

const appVersion = getBuildVersion() // 项目版本（每次发版之前记得更新版本号）

// 支持的环境
const environment = 'test1' // web测试环境

const webConfig = {
    clientPort,
    development: {
        // 本地开发使用
        host: `/${environment}`, // 这里切换本地开发依赖什么环境接口
    },
    appVersion,
}

console.log(`%cwebConfig`, 'color: #0ab76d; font-weight: bold;', webConfig)

console.table({
    'process.env.NODE_ENV': process.env.NODE_ENV,
    'process.env.BUILD_ENV': process.env.BUILD_ENV,
    environment,
})

export default webConfig
