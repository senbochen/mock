import { App } from 'vue'
import { ConfigProvider, Button, Empty, NavBar, Loading, List } from 'vant'

export default {
  install: (app: App): void => {
    app
      .use(ConfigProvider)
      .use(Button)
      .use(Empty)
      .use(NavBar)
      .use(Loading)
      .use(List)
  },
}
