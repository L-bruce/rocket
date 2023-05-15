/* eslint-disable no-underscore-dangle */
import { createStore, applyMiddleware, AnyAction } from 'redux'
import thunk, { ThunkDispatch } from 'redux-thunk'
import { logger } from 'redux-logger'
import reducer from './reducer'
import Invoke from '@/src/api/invoke'

const isProduction = process.env.NODE_ENV == 'production'

const middle = [thunk.withExtraArgument(Invoke)]

if (!isProduction) {
    middle.push(logger)
}

// 服务端store
export const getServerStore = () => {
    return createStore(reducer, applyMiddleware(...middle))
}

// 客户端store
export const getClientStore = () => {
    const defaultState = window.context ? window.context.state : {}
    const store = createStore(reducer, defaultState, applyMiddleware(...middle))

    window.__store__ = store

    return store
}

export type StoreType = ReturnType<typeof getClientStore>

export type RootState = ReturnType<StoreType['getState']>

export type AppDispatch = StoreType['dispatch'] & ThunkDispatch<RootState, unknown, AnyAction>
