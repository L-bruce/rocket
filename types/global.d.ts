/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Connect } from 'react-redux'
import * as H from 'history'
import type { NavigateFunction, NavigationType } from 'react-router'
import API from '@/src/api/api'

type NetType = {
    isBrowser: boolean
    isServer: boolean
}

type CreateApiType<T> = T extends Record<string, any>
    ? {
          [key in keyof T]: CreateApiType<T[key]>
      }
    : <P = any>(
          ...params: any
      ) => Promise<{ code: number; message: string; result: P; success: boolean; [T: string]: any }>

type RouteInfoType = {
    path: string
    html: string
    exact: string
    component: React.ReactElement
}

declare global {
    const Invoke: CreateApiType<typeof API>
    const React: typeof React
    const connect: Connect
    interface PageBaseProps {
        location: H.Location
        navigateType: NavigationType
        navigate: NavigateFunction
        match: {
            params: Readonly<Params<string>>
            path: string
            url: string
        }
        route: RouteInfoType
    }

    interface Window {
        __store__: any
        context: {
            state: object
        }
        location: any
    }
}
