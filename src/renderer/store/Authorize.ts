import { Module, ActionTree } from 'vuex'
import { RootState } from '@/store'
import { MyWindow } from '~/src/types/global'

const win = window as any as MyWindow

export type AuthorizeState = {}

const state = (): AuthorizeState => ({})

export const ACTION_TYPES = {
  SUBMIT: 'submit'
}

const actions: ActionTree<AuthorizeState, RootState> = {
  [ACTION_TYPES.SUBMIT]: async (_, request: { code: string | null; sns: 'mastodon' | 'pleroma' | 'misskey' }): Promise<string> => {
    let req = {
      sns: request.sns
    }
    if (request.code) {
      req = Object.assign(req, {
        code: request.code.trim()
      })
    }
    const id = await win.ipcRenderer.invoke('get-and-update-access-token', req)
    return id
  }
}

const Authorize: Module<AuthorizeState, RootState> = {
  namespaced: true,
  state: state,
  mutations: {},
  actions: actions
}

export default Authorize
