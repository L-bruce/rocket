import React, { useEffect, useMemo } from 'react'
import { debounce } from 'throttle-debounce'

import useLast from './useLast'

type noop = (...args: any[]) => any

export interface DebounceOptions {
    wait?: number
    atBegin?: boolean
}

function useDebounceFn<T extends noop>(fn: T, options?: DebounceOptions) {
    const fnRef = useLast(fn)

    const wait = options?.wait ?? 1000

    const debounced = useMemo(
        () =>
            debounce(wait, options?.atBegin, (...args: Parameters<T>): ReturnType<T> => {
                return fnRef.current(...args)
            }),
        []
    )

    useEffect(
        () => () => {
            debounced.cancel()
        },
        []
    )

    return debounced
}

export default useDebounceFn
