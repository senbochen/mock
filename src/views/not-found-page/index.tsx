import { defineComponent } from 'vue'

const name = 'NotFoundPage'

export default defineComponent({
  name,

  setup() {
    const renderPage = () => {
      return (
        <div class={`full-page-container vertical-center-by-flex`}>
          <van-empty image="error" description="您访问的页面不存在" />
        </div>
      )
    }

    return () => renderPage()
  },
})
