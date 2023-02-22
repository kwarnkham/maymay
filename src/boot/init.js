import { LocalStorage } from 'quasar'
import { boot } from 'quasar/wrappers'
import { api } from './axios'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async () => {
  const token = LocalStorage.getItem('token')
  if (token) api({
    method: 'GET',
    url: "api/users/token"
  }).then(response => {
    if (response.data.user) {

    } else {
      LocalStorage.remove('token')
    }
  }).catch(error => {
    console.error(error)
    LocalStorage.remove('token')
  })
})
