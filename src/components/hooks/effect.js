import { useRef, useCallback } from 'react'

// 给异步函数加锁，防止并发
function useLockFn(fn) {
    const lockRef = useRef(false)

    return useCallback(
        async (...args) => {
            if (lockRef.current) return
            lockRef.current = true
            try {
                const ret = await fn(...args)

                lockRef.current = false

                return ret
            } catch (e) {
                lockRef.current = false
                throw e
            }
        },
        [fn]
    )
}

export { useLockFn }
