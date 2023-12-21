import { App, Plugin } from 'vue'
import V3waterfall from './v3-waterfall.vue'


V3waterfall.install = function (app: App) {
  app.component(V3waterfall.name, V3waterfall)

  return app
}

export default V3waterfall as typeof V3waterfall & Plugin
