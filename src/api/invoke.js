import API from './api'
import { get, post } from './request-instance.js'

const createRequest = function (obj) {
    const result = {}
    const array = Object.entries(obj)

    for (let index = 0; index < array.length; index++) {
        const [key, value] = array[index]

        if (key.startsWith('post')) {
            result[key] = (data, options, req, res) => post(value, data, options, req, res)
        } else if (key.startsWith('json')) {
            result[key] = (data, options, req, res) => post(value, data, { ...options, requestType: 'json' }, req, res)
        } else {
            result[key] = (data, options, req, res) => get(value, data, options, req, res)
        }
    }

    return result
}

const createApiInvoke = function (obj) {
    const result = {}
    const array = Object.entries(obj)

    for (let index = 0; index < array.length; index++) {
        const [key, value] = array[index]

        if (typeof value == 'object') {
            result[key] = createRequest(value)
        }
    }

    return result
}

export default createApiInvoke(API)
