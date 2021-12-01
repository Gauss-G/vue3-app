
import state from './shopCartState'
import getters from './shopCartGetters'
import mutations from './shopCartMutations'
import actions from './shopCartActions'

const module = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

export default module
