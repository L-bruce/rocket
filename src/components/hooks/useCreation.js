import { useRef } from 'react'

// 判断两个依赖数据 是不是相等，一致
const depsAreSame = (oldDeps, deps) => {
    if (oldDeps === deps) return true

    for (let i = 0; i < oldDeps.length; i++) {
        if (!Object.is(oldDeps[i], deps[i])) return false
    }

    return true
}

// 避免下面这种情况
// const a = useRef(new Subject()); // 每次重渲染，都会执行实例化 Subject 的过程，即便这个实例立刻就被扔掉了
// const b = useCreation(() => new Subject(), []); // 通过 factory 函数，可以避免性能隐患

const useCreation = (fn, deps = []) => {
    const { current } = useRef({ deps, obj: undefined, initialized: false })

    if (current.initialized === false || !depsAreSame(current.deps, deps)) {
        current.deps = deps
        current.obj = fn()
        current.initialized = true
    }

    return current.obj
}

export default useCreation
