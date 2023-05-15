/* eslint-disable no-cond-assign */
export const readCookie = function (name: string) {
    let arr
    const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`)

    if ((arr = document.cookie.match(reg))) {
        return unescape(arr[2])
    }

    return null
}

// expires 为设置cookie过期时间，单位为天，不传则默认关闭浏览器过期
export const writeCookie = function (name: string, value: string, expires: number, unit: string) {
    let expDays = 0

    switch (unit) {
        case 'ms':
            expDays = expires

            break
        default:
            expDays = expires * 24 * 60 * 60 * 1000

            break
    }
    const expDate = new Date()

    expDate.setTime(expDate.getTime() + expDays)
    const expString = expires ? `;expires=${expDate.toUTCString()}` : ''

    document.cookie = `${name}=${escape(value)}${expString};path=/`
}

export const delCookie = function (name: string) {
    const exp = new Date(new Date().getTime() - 1)
    const s = readCookie(name)

    if (s != null) {
        document.cookie = `${name}=${s};expires=${exp.toUTCString()};path=/`
    }
}

// 格式化时间
export const formatTime = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return `${[year, month, day].map(formatShortNumber).join('/')} ${[hour, minute, second].join(':')}`
}

// 格式化日期
export const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return [year, month, day].map(formatShortNumber).join('/')
}

const formatShortNumber = (n: number) => {
    const str = n.toString()

    return str[1] ? str : `0${str}`
}

// 是否IE浏览器
export function isIE() {
    return /msie|trident/g.test(window.navigator.userAgent.toLowerCase())
}

export function unescapeHtml(str: string) {
    return str
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
}

/**
 * 处理价格，以千逗号分位并做展示
 */
export const thousandPrice = (initPrice: number | string) => {
    const price = parseFloat(initPrice.toString())

    if (Number.isNaN(price)) return

    const priceStr = price.toString()
    let integerNum = priceStr.split('.')[0] // 整数部分
    const decimalNum = priceStr.split('.')[1] // 小数部分
    let result: string // 声明价格结果
    const resultArray = [] // 定义数组记录截取后的价格

    if (integerNum.length > 3) {
        let editable = true

        while (editable) {
            resultArray.push(integerNum.slice(-3))
            integerNum = integerNum.slice(0, integerNum.length - 3)
            if (integerNum.length < 4) {
                editable = false
            }
        }

        resultArray.reverse() // 将价格数组按照顺序倒转成一开始的字符顺序
        result = decimalNum
            ? `${integerNum},${resultArray.join(',')}.${decimalNum}`
            : `${integerNum},${resultArray.join(',')}`
    } else {
        result = priceStr
    }

    return result
}

/**
 * 处理千分位 转为数字
 */
export const unThousandPrice = (initPrice: string) => {
    const price = initPrice.replace(/,/g, '')

    return parseFloat(price)
}

// 获取url地址的search字符串
export const getQueryString = (url: string, name: string) => {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
    const r = url.substr(1).match(reg)

    if (r != null) return decodeURI(r[2])

    // unescape    解码方法
    return null
}

// 获取列表
export const getList = <T extends unknown[] | null | undefined>(list: T): T => (list || []) as T
// 获取对象
export const getObject = <T extends Record<string, unknown> | null | undefined>(data: T): T => (data || {}) as T
// 禁止冒泡
export const stop = (e: React.BaseSyntheticEvent | Event) => e.stopPropagation()
// 阻止默认事件
export const preDefault = (e: React.BaseSyntheticEvent | Event) => e.preventDefault()
// 空函数
// eslint-disable-next-line @typescript-eslint/no-empty-function, prettier/prettier
export const noop = () => {}

// 分割数组为小数组
export const splitArray = <T>(array: T[], length: number): T[][] => {
    let index = 0
    const newArray = []

    while (index < array.length) {
        newArray.push(array.slice(index, (index += length)))
    }

    return newArray
}

// 判断el是否属于select的子元素
export const closest = (el, selector: string): boolean => {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector

    while (el) {
        if (matchesSelector.call(el, selector)) {
            return true
        }
        el = el.parentElement
    }

    return false
}

/**
 * 复制文本
 * @param options
 */
export function copyText(options: { text: string; origin?: boolean }) {
    const props = { origin: true, ...options }

    let input: HTMLInputElement | HTMLTextAreaElement

    if (props.origin) {
        input = document.createElement('textarea')
    } else {
        input = document.createElement('input')
    }

    input.setAttribute('readonly', 'readonly')
    input.style.position = 'fixed'
    input.style.bottom = '-300px'
    input.value = props.text
    document.body.appendChild(input)
    input.select()
    let result = false

    if (document.execCommand && typeof document.execCommand === 'function') {
        result = document.execCommand('copy')
    }

    document.body.removeChild(input)

    return result
}
