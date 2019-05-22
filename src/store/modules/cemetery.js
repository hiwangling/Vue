import { get_order_status } from '@/api/buy'
const state = {
  cems: null,
  pay: ''
}

const mutations = {
  ADD_CEMETERY: (state, cems) => {
    state.cems = cems
  },
  ADD_PAY: (state, pay) => {
    state.pay = pay
  }
}

const actions = {
  addCemetery({ commit }, cems) {
    commit('ADD_CEMETERY', cems)
  },
  pay({ commit }, cid) {
    return new Promise((resolve, reject) => {
      const data = { cid: cid }
      get_order_status(data).then(response => {
        const { data } = response
        if (data.order_status) {
          commit('ADD_PAY', data.order_status)
        } else {
          commit('ADD_PAY', 1)
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
