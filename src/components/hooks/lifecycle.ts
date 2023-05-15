import { useRef, useEffect } from 'react'

// 组件在挂载前执行，常用于ssr 格式化数据
// 注意！！！  函数 func 需要在hooks 前声明
const useComponentWillMount = (func: React.EffectCallback) => {
    const willMount = useRef(true)

    if (willMount.current) {
        func()
    }
    willMount.current = false
}

//  只依赖更新的useEffect
const useUpdateEffect = (effect: React.EffectCallback, deps?: React.DependencyList) => {
    const isMounted = useRef(false)

    // for react-refresh
    useEffect(() => {
        return () => {
            isMounted.current = false
        }
    }, [])

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true
        } else {
            return effect()
        }
    }, deps)
}

export { useComponentWillMount, useUpdateEffect }
