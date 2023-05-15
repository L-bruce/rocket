/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
    const path: string
    export default path
}

declare module '*.bmp' {
    const path: string
    export default path
}

declare module '*.gif' {
    const path: string
    export default path
}

declare module '*.jpg' {
    const path: string
    export default path
}

declare module '*.jpeg' {
    const path: string
    export default path
}

declare module '*.png' {
    const path: string
    export default path
}

declare module '*.css' {
    const classes: Record<string, string>
    export default classes
}

declare module '*.scss' {
    const classes: Record<string, string>
    export default classes
}

declare let process: any
