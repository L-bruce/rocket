import { useRef } from 'react'

//  初始化函数只会执行一次的ref
const useInertRef = fn => {
    const ref = useRef(null)

    if (ref.current === null) {
        ref.current = fn()
    }

    return ref
}

export default useInertRef
