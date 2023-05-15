import webConfig from '@/src/web.config.js'

let host = ''

// 开发环境添加请求前缀
if (process.env.NODE_ENV == 'development') {
    host = webConfig.development.host
}

const API = {
    host,
    common: {},
}

export default API
