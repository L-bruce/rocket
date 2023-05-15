import { useRef } from 'react'

//  保持值始终是最新的
const useLast = value => {
    const ref = useRef(value)

    ref.current = value

    return ref
}

export default useLast
