import { createStore, Store } from 'vuex'
import { ipcMain, ipcRenderer } from '~/spec/mock/electron'
import Login, { LoginState } from '@/store/Login'
import { MyWindow } from '~/src/types/global'
import { RootState } from '@/store'
;(window as any as MyWindow).ipcRenderer = ipcRenderer

jest.mock('megalodon', () => ({
  ...jest.requireActual<object>('megalodon'),
  detector: jest.fn(() => 'pleroma'),
  __esModule: true
}))

const state = (): LoginState => {
  return {
    selectedInstance: null,
    searching: false,
    sns: 'mastodon'
  }
}

const initStore = () => {
  return {
    namespaced: true,
    state: state(),
    actions: Login.actions,
    mutations: Login.mutations
  }
}

const appState = {
  namespaced: true,
  state: {
    proxyConfiguration: false
  }
}

describe('Login', () => {
  let store: Store<RootState>

  beforeEach(() => {
    store = createStore({
      modules: {
        Login: initStore(),
        App: appState
      }
    })
  })

  describe('fetchLogin', () => {
    describe('error', () => {
      it('should return error', async () => {
        ipcMain.handle('get-auth-url', () => {
          throw new Error()
        })
        await store.dispatch('Login/fetchLogin', 'pleroma.io').catch((err: Error) => {
          expect(err instanceof Error).toEqual(true)
        })
        ipcMain.removeHandler('get-auth-url')
      })
    })
    describe('success', () => {
      it('should return url', async () => {
        ipcMain.handle('get-auth-url', () => {
          return 'http://example.com/auth'
        })
        const url = await store.dispatch('Login/fetchLogin', 'pleroma.io')
        expect(url).toEqual('http://example.com/auth')
        ipcMain.removeHandler('get-auth-url')
      })
    })
  })

  describe('pageBack', () => {
    it('should reset instance', () => {
      store.dispatch('Login/pageBack')
      expect(store.state.Login.selectedInstance).toEqual(null)
    })
  })

  describe('confirmInstance', () => {
    it('should change instance', async () => {
      const result = await store.dispatch('Login/confirmInstance', 'pleroma.io')
      expect(result).toEqual(true)
      expect(store.state.Login.selectedInstance).toEqual('pleroma.io')
    })
  })
})
