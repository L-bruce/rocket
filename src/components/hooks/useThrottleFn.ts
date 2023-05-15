import React, { useEffect, useMemo } from 'react'
import { throttle } from 'throttle-debounce'

import useLast from './useLast'

type noop = (...args: any[]) => any

export interface ThrottleOptions {
    wait?: number
    noTrailing?: boolean
    debounceMode?: boolean
}

function useThrottleFn<T extends noop>(fn: T, options?: ThrottleOptions) {
    const fnRef = useLast(fn)

    const wait = options?.wait ?? 1000

    const throttled = useMemo(
        () =>
            throttle(
                wait,
                options?.noTrailing,
                (...args: Parameters<T>): ReturnType<T> => {
                    return fnRef.current(...args)
                },
                options?.debounceMode
            ),
        []
    )

    useEffect(
        () => () => {
            throttled.cancel()
        },
        []
    )

    return throttled
}

export default useThrottleFn
