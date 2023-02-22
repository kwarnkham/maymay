import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { LocalStorage } from 'quasar'
import { useUserStore } from 'src/stores/user-store'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: process.env.API_URL })

export default boot(async ({ app, store }) => {
  const userStore = useUserStore(store)
  const token = LocalStorage.getItem("token");
  if (token) {
    api.defaults.headers.common['Authorization'] = "Bearer " + token;
    try {
      const response = await api({
        method: "GET",
        url: "users/token",
      })
      userStore.setUser(response.data.user)
    } catch (error) {
      LocalStorage.remove('token')
      api.defaults.headers.common['Authorization'] = undefined;
    }
  }

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
