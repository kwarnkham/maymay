import { EventBus } from 'quasar'
import { boot } from 'quasar/wrappers'

export default boot(async ({ app }) => {
  const bus = new EventBus()

  app.provide('bus', bus)
})
