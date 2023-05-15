import { combineReducers } from 'redux'

import globalReducer, { Prefix as gPrefix } from './reducer/global'

// 所有reducer合并后进行导出
export default combineReducers({
    [gPrefix]: globalReducer,
})
