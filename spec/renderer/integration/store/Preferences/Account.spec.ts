import { createStore, Store } from 'vuex'
import { ipcMain, ipcRenderer } from '~/spec/mock/electron'
import Account, { AccountState } from '@/store/Preferences/Account'
import { LocalAccount } from '~/src/types/localAccount'
import { MyWindow } from '~/src/types/global'
import { RootState } from '@/store'
;(window as any as MyWindow).ipcRenderer = ipcRenderer

const account: LocalAccount = {
  _id: 'sample',
  baseURL: 'http://example.com',
  domain: 'example.com',
  clientId: 'hoge',
  clientSecret: 'hogehoge',
  accessToken: null,
  refreshToken: null,
  username: null,
  accountId: null,
  avatar: null,
  order: 1
}

const state = (): AccountState => {
  return {
    accounts: [],
    accountLoading: false
  }
}

const initStore = () => {
  return {
    namespaced: true,
    state: state(),
    actions: Account.actions,
    mutations: Account.mutations
  }
}

const preferencesStore = () => ({
  namespaced: true,
  modules: {
    Account: initStore()
  }
})

describe('Account', () => {
  let store: Store<RootState>

  beforeEach(() => {
    store = createStore({
      modules: {
        Preferences: preferencesStore()
      }
    })
  })

  describe('loadAccounts', () => {
    it('error', async () => {
      ipcMain.handle('list-accounts', async () => {
        throw new Error()
      })

      await store.dispatch('Preferences/Account/loadAccounts').catch((err: Error) => {
        expect(err instanceof Error).toEqual(true)
      })
      ipcMain.removeHandler('list-accounts')
    })
    it('success', async () => {
      ipcMain.handle('list-accounts', () => {
        return [account]
      })
      await store.dispatch('Preferences/Account/loadAccounts')
      expect(store.state.Preferences.Account.accounts).toEqual([account])
      ipcMain.removeHandler('list-accounts')
    })
  })

  describe('removeAccount', () => {
    it('error', async () => {
      ipcMain.handle('remove-account', async () => {
        throw new Error()
      })
      await store.dispatch('Preferences/Account/removeAccount', account).catch((err: Error) => {
        expect(err instanceof Error).toEqual(true)
      })
      ipcMain.removeHandler('remove-account')
    })
    it('success', async () => {
      ipcMain.handle('remove-account', () => {
        return true
      })
      const res = await store.dispatch('Preferences/Account/removeAccount', account)
      expect(res).toEqual(undefined)
      ipcMain.removeHandler('remove-account')
    })
  })

  describe('forwardAccount', () => {
    it('error', async () => {
      ipcMain.handle('forward-account', async () => {
        throw new Error()
      })
      await store.dispatch('Preferences/Account/forwardAccount', account).catch((err: Error) => {
        expect(err instanceof Error).toEqual(true)
      })
      ipcMain.removeHandler('forward-account')
    })
    it('success', async () => {
      ipcMain.handle('forward-account', () => {
        return {}
      })
      const res = await store.dispatch('Preferences/Account/forwardAccount', account)
      expect(res).toEqual(undefined)
      ipcMain.removeHandler('forward-account')
    })
  })

  describe('backwardAccount', () => {
    it('error', async () => {
      ipcMain.handle('backward-account', () => {
        throw new Error()
      })
      await store.dispatch('Preferences/Account/backwardAccount', account).catch((err: Error) => {
        expect(err instanceof Error).toEqual(true)
      })
      ipcMain.removeHandler('backward-account')
    })
    it('success', async () => {
      ipcMain.handle('backward-account', () => {
        return {}
      })
      const res = await store.dispatch('Preferences/Account/backwardAccount', account)
      expect(res).toEqual(undefined)
      ipcMain.removeHandler('backward-account')
    })
  })

  describe('removeAllAccounts', () => {
    it('error', async () => {
      ipcMain.handle('remove-all-accounts', () => {
        throw new Error()
      })
      await store.dispatch('Preferences/Account/removeAllAccounts', account).catch((err: Error) => {
        expect(err instanceof Error).toEqual(true)
      })
      ipcMain.removeHandler('remove-all-accounts')
    })
    it('success', async () => {
      ipcMain.handle('remove-all-accounts', () => {
        return {}
      })
      const res = await store.dispatch('Preferences/Account/removeAllAccounts', account)
      expect(res).toEqual(undefined)
      ipcMain.removeHandler('remove-all-accounts')
    })
  })
})
