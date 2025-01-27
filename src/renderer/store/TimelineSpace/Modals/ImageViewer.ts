import { Module, MutationTree, ActionTree, GetterTree } from 'vuex'
import { Entity } from 'megalodon'
import { RootState } from '@/store'

export type ImageViewerState = {
  modalOpen: boolean
  currentIndex: number
  mediaList: Array<Entity.Attachment>
  loading: boolean
}

const state = (): ImageViewerState => ({
  modalOpen: false,
  currentIndex: -1,
  mediaList: [],
  loading: false
})

export const MUTATION_TYPES = {
  CHANGE_MODAL: 'changeModal',
  CHANGE_CURRENT_INDEX: 'changeCurrentIndex',
  CHANGE_MEDIA_LIST: 'changeMediaList',
  INCREMENT_INDEX: 'incrementIndex',
  DECREMENT_INDEX: 'decrementIndex',
  CHANGE_LOADING: 'changeLoading'
}

const mutations: MutationTree<ImageViewerState> = {
  [MUTATION_TYPES.CHANGE_MODAL]: (state, value: boolean) => {
    state.modalOpen = value
  },
  [MUTATION_TYPES.CHANGE_CURRENT_INDEX]: (state, currentIndex: number) => {
    state.currentIndex = currentIndex
  },
  [MUTATION_TYPES.CHANGE_MEDIA_LIST]: (state, mediaList: Array<Entity.Attachment>) => {
    state.mediaList = mediaList
  },
  [MUTATION_TYPES.INCREMENT_INDEX]: state => {
    state.currentIndex++
  },
  [MUTATION_TYPES.DECREMENT_INDEX]: state => {
    state.currentIndex--
  },
  [MUTATION_TYPES.CHANGE_LOADING]: (state, value: boolean) => {
    state.loading = value
  }
}

export const ACTION_TYPES = {
  OPEN_MODAL: 'openModal',
  CLOSE_MODAL: 'closeModal',
  INCREMENT_INDEX: 'incrementIndex',
  DECREMENT_INDEX: 'decrementIndex',
  LOADED: 'loaded'
}

const actions: ActionTree<ImageViewerState, RootState> = {
  [ACTION_TYPES.OPEN_MODAL]: ({ commit }, { currentIndex, mediaList }) => {
    commit(MUTATION_TYPES.CHANGE_MODAL, true)
    commit(MUTATION_TYPES.CHANGE_CURRENT_INDEX, currentIndex as number)
    commit(MUTATION_TYPES.CHANGE_MEDIA_LIST, mediaList as Array<Entity.Attachment>)
    commit(MUTATION_TYPES.CHANGE_LOADING, true)
  },
  [ACTION_TYPES.CLOSE_MODAL]: ({ commit }) => {
    commit(MUTATION_TYPES.CHANGE_MODAL, false)
    commit(MUTATION_TYPES.CHANGE_CURRENT_INDEX, -1)
    commit(MUTATION_TYPES.CHANGE_MEDIA_LIST, [])
    commit(MUTATION_TYPES.CHANGE_LOADING, false)
  },
  [ACTION_TYPES.INCREMENT_INDEX]: ({ commit }) => {
    commit(MUTATION_TYPES.INCREMENT_INDEX)
    commit(MUTATION_TYPES.CHANGE_LOADING, true)
  },
  [ACTION_TYPES.DECREMENT_INDEX]: ({ commit }) => {
    commit(MUTATION_TYPES.DECREMENT_INDEX)
    commit(MUTATION_TYPES.CHANGE_LOADING, true)
  },
  [ACTION_TYPES.LOADED]: ({ commit }) => {
    commit(MUTATION_TYPES.CHANGE_LOADING, false)
  }
}

const getters: GetterTree<ImageViewerState, RootState> = {
  imageURL: (state): string | null => {
    if (state.currentIndex >= 0) {
      return state.mediaList[state.currentIndex].url
    }
    return null
  },
  imageType: (state): string | null => {
    if (state.currentIndex >= 0) {
      return state.mediaList[state.currentIndex].type
    }
    return null
  },
  showLeft: (state): boolean => {
    const notFirst = state.currentIndex > 0
    const isManyItem = state.mediaList.length > 1
    return notFirst && isManyItem
  },
  showRight: (state): boolean => {
    const notLast = state.currentIndex < state.mediaList.length - 1
    const isManyItem = state.mediaList.length > 1
    return notLast && isManyItem
  }
}

const ImageViewer: Module<ImageViewerState, RootState> = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default ImageViewer
