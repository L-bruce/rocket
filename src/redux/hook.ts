import { TypedUseSelectorHook, useDispatch as dispatch, useSelector as selector } from 'react-redux'
import type { RootState, AppDispatch } from './index'

export const useDispatch = () => dispatch<AppDispatch>()
export const useSelector: TypedUseSelectorHook<RootState> = selector

export { RootState, AppDispatch }
