import { App } from 'vue'
import V3waterfall from './v3-waterfall.vue'

export { V3waterfall }

const V3waterfallInstance = {
  install: (app: App): App => {
    app.component(V3waterfall.name, V3waterfall)
    return app
  }
}

export default V3waterfallInstance
