import { createApp } from 'vue'
import App from './App.vue'
import { store, key } from './store'
import router from './router'
import vant from './vant'
import directives from './directives/index'
import globalMixin from './mixin/global'
import './server/axios'
import './styles/index.scss'
import makeServer from './mirage/index'
makeServer()
if (process.env.VUE_APP_ENV_TYPE !== 'production') {
  Promise.all([import('vconsole')]).then((res) => {
    if (res.length === 1) {
      const VConsole = res[0].default
      new VConsole()
    }
  })
}

createApp(App)
  .use(store, key)
  .use(router)
  .use(vant)
  .use(directives)
  .use(globalMixin)

  .mount('#app')
