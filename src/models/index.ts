import NPage from "./NPage"
import { init, RematchDispatch, RematchRootState, Models } from '@rematch/core'
import createLoadingPlugin from '@rematch/loading'
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type {LoadingConfig,LoadingPluginType} from '@rematch/loading'

export type Store = typeof store
export interface RootModel extends Models<RootModel> {
  NPage: typeof NPage,
}

export const useStoreDispatch: () => RematchDispatch<RootModel> = useDispatch
export const useStoreSelector: TypedUseSelectorHook<
  RematchRootState<RootModel>
> = useSelector

const options = {
  asNumber: true,
  name: 'load'
}
const loading = createLoadingPlugin(options)
// const store = init({ 
//   models,
//   plugins: [loading]
// })

export const models: RootModel = { NPage }
export const store = init({
  models,
  plugins: [loading]
})
// export default {NPage}