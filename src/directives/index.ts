import { App } from 'vue'
import VLoading from './loading/index'
import vShake from './shake/index'
import vSwiper from './swiper/index'
export default {
  install: (app: App): void => {
    app.directive('loading', VLoading)
    app.directive('shake', vShake)
    app.directive('swiper', vSwiper)
  },
}
