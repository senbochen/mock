import { defineComponent } from 'vue'

const name = 'RefusePage'

export default defineComponent({
  name,

  setup() {
    const renderPage = () => {
      return (
        <div class={`full-page-container vertical-center-by-flex`}>
          <p>无法访问该页面无法访问该页面无法访问该页面</p>
          <van-empty image="error" description="无法访问该页面" />
        </div>
      )
    }

    return () => renderPage()
  },
})
