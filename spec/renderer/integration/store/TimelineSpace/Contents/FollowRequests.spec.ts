import { Entity, Response } from 'megalodon'
import { createStore, Store } from 'vuex'
import FollowRequests, { FollowRequestsState } from '@/store/TimelineSpace/Contents/FollowRequests'
import { SideMenuState } from '@/store/TimelineSpace/SideMenu'
import { RootState } from '@/store'

const mockClient = {
  getFollowRequests: () => {
    return new Promise<Response<Array<Entity.Account>>>(resolve => {
      const res: Response<Array<Entity.Account>> = {
        data: [account],
        status: 200,
        statusText: 'OK',
        headers: {}
      }
      resolve(res)
    })
  },
  acceptFollowRequest: () => {
    return new Promise<Response<{}>>(resolve => {
      const res: Response<{}> = {
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {}
      }
      resolve(res)
    })
  },
  rejectFollowRequest: () => {
    return new Promise<Response<{}>>(resolve => {
      const res: Response<{}> = {
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {}
      }
      resolve(res)
    })
  }
}

jest.mock('megalodon', () => ({
  ...jest.requireActual<object>('megalodon'),
  default: jest.fn(() => mockClient),
  __esModule: true
}))

const account: Entity.Account = {
  id: '1',
  username: 'h3poteto',
  acct: 'h3poteto@pleroma.io',
  display_name: 'h3poteto',
  locked: false,
  created_at: '2019-03-26T21:30:32',
  followers_count: 10,
  following_count: 10,
  statuses_count: 100,
  note: 'engineer',
  url: 'https://pleroma.io',
  avatar: '',
  avatar_static: '',
  header: '',
  header_static: '',
  emojis: [],
  moved: null,
  fields: null,
  bot: false
}

let state = (): FollowRequestsState => {
  return {
    requests: []
  }
}

const initStore = () => {
  return {
    namespaced: true,
    state: state(),
    actions: FollowRequests.actions,
    mutations: FollowRequests.mutations
  }
}

const sideMenuState = (): SideMenuState => {
  return {
    unreadHomeTimeline: false,
    unreadNotifications: false,
    unreadMentions: false,
    unreadLocalTimeline: false,
    unreadDirectMessagesTimeline: false,
    unreadPublicTimeline: false,
    unreadFollowRequests: false,
    lists: [],
    tags: [],
    collapse: false,
    enabledTimelines: {
      home: true,
      notification: true,
      mention: true,
      direct: true,
      favourite: true,
      bookmark: true,
      local: true,
      public: true,
      tag: true,
      list: true
    }
  }
}

const sideMenuStore = () => ({
  namespaced: true,
  state: sideMenuState(),
  actions: {
    fetchFollowRequests: jest.fn()
  },
  mutations: {}
})

const contentsStore = () => ({
  namespaced: true,
  modules: {
    FollowRequests: initStore()
  }
})

const timelineStore = () => ({
  namespaced: true,
  modules: {
    SideMenu: sideMenuStore(),
    Contents: contentsStore()
  },
  state: {
    account: {
      accessToken: 'token',
      baseURL: 'http://localhost'
    },
    sns: 'mastodon'
  }
})

const appState = {
  namespaced: true,
  state: {
    proxyConfiguration: false
  }
}

describe('Home', () => {
  let store: Store<RootState>

  beforeEach(() => {
    store = createStore({
      modules: {
        TimelineSpace: timelineStore(),
        App: appState
      }
    })
  })

  describe('fetchRequests', () => {
    it('should be updated', async () => {
      await store.dispatch('TimelineSpace/Contents/FollowRequests/fetchRequests')
      expect(store.state.TimelineSpace.Contents.FollowRequests.requests).toEqual([account])
    })
  })

  describe('acceptRequest', () => {
    beforeAll(() => {
      state = () => {
        return {
          requests: [account]
        }
      }
    })
    it('should be succeed', async () => {
      mockClient.getFollowRequests = () => {
        return new Promise<Response<Array<Entity.Account>>>(resolve => {
          const res: Response<Array<Entity.Account>> = {
            data: [],
            status: 200,
            statusText: 'OK',
            headers: {}
          }
          resolve(res)
        })
      }

      await store.dispatch('TimelineSpace/Contents/FollowRequests/acceptRequest', account)
      expect(store.state.TimelineSpace.Contents.FollowRequests.requests).toEqual([])
    })
  })

  describe('rejectRequest', () => {
    beforeAll(() => {
      state = () => {
        return {
          requests: [account]
        }
      }
    })
    it('should be succeed', async () => {
      mockClient.getFollowRequests = () => {
        return new Promise<Response<Array<Entity.Account>>>(resolve => {
          const res: Response<Array<Entity.Account>> = {
            data: [],
            status: 200,
            statusText: 'OK',
            headers: {}
          }
          resolve(res)
        })
      }

      await store.dispatch('TimelineSpace/Contents/FollowRequests/rejectRequest', account)
      expect(store.state.TimelineSpace.Contents.FollowRequests.requests).toEqual([])
    })
  })
})
