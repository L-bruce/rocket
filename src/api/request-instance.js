import API from '@/src/api/api'
import createClientRequest from './request-client'

// 处理接口错误和异常
const initOptions = {
    baseURL: API.host,
}

const requestInstance = createClientRequest({
    initOptions,
    responseSuccess(res) {},
    responseFailValue(error) {},
})

export const { request, get, post } = requestInstance

export default requestInstance
