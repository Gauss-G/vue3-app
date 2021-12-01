import { createStore } from 'vuex'
import globalStores from './stores'

const domainStoreFiles = import.meta.globEager('../src/modules/**/store.ts')

const domainStores = Object.entries(domainStoreFiles)
  .reduce((prev, [key, value]) => {
    prev[key] = value
    return prev
  }, {})

const store = createStore({
  strict: import.meta.env.DEV,
  modules: {
    ...globalStores,
    ...domainStores,
  } as any,
})

export default store
