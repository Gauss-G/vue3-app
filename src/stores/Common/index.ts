
import state from './commonState'
import getters from './commonGetters'
import mutations from './commonMutations'
import actions from './commonActions'

const module = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

export default module
