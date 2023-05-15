/* eslint-disable default-param-last */
import { createAction } from 'redux-actions'
import Immer from 'immer'

export const Prefix = 'global'

export const types = {
    setLoginStatus: `${Prefix}/setLoginStatus`,
    setUserInfo: `${Prefix}/setUserInfo`,
    setRenderStatus: `${Prefix}/setRenderStatus`,
}

export const actions = {
    modifyLoginStatus:
        (data = true) =>
        async dispatch => {
            dispatch(actions.setLoginStatus(data))
        },

    setLoginStatus: createAction(types.setLoginStatus),
    setUserInfo: createAction(types.setUserInfo),
    setRenderStatus: createAction(types.setRenderStatus),

    getUserInfo: () => async (dispatch, getState, Invoke) => {},
}

const defaultState = {
    isLogin: false,
    userInfo: {},
    authStatus: false,
    renderStatus: 'success',
}

export default function reducer(state = defaultState, { type, payload }) {
    return Immer(state, draft => {
        switch (type) {
            case types.setLoginStatus:
                console.log('改变登录状态', payload)
                draft.isLogin = payload
                break

            case types.setUserInfo:
                console.log('设置用户信息', payload)
                draft.userInfo = payload
                break

            case types.setRenderStatus:
                draft.renderStatus = payload
                break

            default:
                break
        }
    })
}
