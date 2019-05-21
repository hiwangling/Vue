const state = {
  cems: null
}

const mutations = {
  ADD_CEMETERY: (state, cems) => {
    state.cems = cems
  }
}

const actions = {
  addCemetery({ commit }, cems) {
    commit('ADD_CEMETERY', cems)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
