import Qs from 'qs'
import axios from 'axios'

// 创建请求接口
export const createRequestInstance = function ({ initOptions, requestFailValue, responseSuccess, responseFailValue }) {
    const axiosInstance = axios.create({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        ...initOptions,
    })

    // 请求时带上cookie
    axiosInstance.defaults.withCredentials = true

    // 添加公共header
    axiosInstance.defaults.headers.common['x-requested-with'] = 'XMLHttpRequest'
    axiosInstance.defaults.timeout = 30000

    // 添加请求拦截器
    axiosInstance.interceptors.request.use(
        function (config) {
            config.metadata = { startTime: new Date() }

            config.headers = { ...config.headers, href: window.location.href }

            return config
        },
        function (error) {
            if (requestFailValue) {
                return requestFailValue(error)
            }

            return Promise.reject(error)
        }
    )

    // 添加一个响应拦截器
    axiosInstance.interceptors.response.use(
        function (response) {
            response.config.metadata.endTime = new Date()
            response.duration = response.config.metadata.endTime - response.config.metadata.startTime

            const resdata = response.data

            console.group(`%cclient请求：`, 'color: #000; font-weight: bold;')
            console.log('response拦截器', response)
            console.log(`%curl：${response.config.url}`, 'color: #0ab76d; font-weight: bold;')
            console.log('参数：', response.config.reqData || {})
            console.log('结果：', resdata)
            console.groupEnd()

            response.data = resdata

            // 测试失败的情景
            const data = response.data

            // 浏览器端（主要是csrf问题）
            // spa 路由切换 碰到resurl 情况
            if (response.headers.resurl) {
                window.location.replace(response.headers.resurl)

                return
            }

            responseSuccess(response)

            return data
        },
        function (error) {
            console.group(`%cclient请求失败：`, 'color: #f51010; font-weight: bold;')
            console.log(`%curl：${error.config.url}`, 'color: #f51010; font-weight: bold;')
            console.log('参数：', error.config.reqData || {})
            console.log(`%c响应：${error.message}`, 'color: #f51010;')
            console.groupEnd()

            error.config.metadata.endTime = new Date()
            error.duration = error.config.metadata.endTime - error.config.metadata.startTime

            // 错误值统一处理
            if (responseFailValue) {
                return responseFailValue(error)
            }

            return Promise.reject(error)
        }
    )

    // 请求函数
    const request = function (options) {
        const config = {
            url: '',
            method: 'get',
            data: {},
            responseType: 'json',
            requestType: 'form',
            headers: {},
            ...options,
        }

        // 设置原始请求数据
        config.reqData = config.data

        // 加密处理
        if (config.method.toLowerCase() == 'get') {
            config.params = config.data
        } else if (config.method.toLowerCase() == 'post' && config.requestType.toLowerCase() == 'json') {
            config.headers['Content-Type'] = 'application/json;charset=utf-8'
        } else {
            config.data = Qs.stringify(config.data)
        }

        return axiosInstance.request(config)
    }

    const get = function (url, data, options) {
        return request({ data, url, ...options, method: 'get' })
    }

    const post = function (url, data, options) {
        return request({ data, url, ...options, method: 'post' })
    }

    return {
        request,
        get,
        post,
    }
}

export default createRequestInstance
