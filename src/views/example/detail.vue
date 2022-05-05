<template>
  <div class="full-page-container">
    <van-nav-bar title="详情" left-arrow @click-left="navigateBack" />
    <div class="common-scroll-container">
      <base-scroll>
        <div class="box box1" v-loading="loading1">
          <van-button type="primary" @click="handleLoading1">
            开启当前容器的loading
          </van-button>
        </div>
        <div
          class="box box2"
          v-loading.fullscreen="loading2"
          kf-loading-text="loading"
          kf-loading-background="rgba(0,0,0,.5)"
          kf-loading-size="58"
          kf-loading-text-size="20"
          kf-loading-type="spinner"
          kf-loading-color="#fff"
          :kf-loading-text-vertical="false"
        >
          <van-button type="primary" @click="handleLoading2">
            开启全屏自定义的loading
          </van-button>
        </div>
        <div
          class="box box3"
          v-loading.toast="loading3"
          kf-loading-text="加载中"
        >
          <van-button type="primary" @click="handleLoading3">
            开启当前容器的toast loading
          </van-button>
        </div>
      </base-scroll>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onActivated, onMounted } from 'vue'
import useNavigation from '@/hooks/useNavigation'
import BaseScroll from '@/components/base-scroll/index.vue'
import useStore from '@/hooks/useStore'

const PAGE_NAME = 'Detail'

export default defineComponent({
  components: {
    BaseScroll,
  },
  name: PAGE_NAME,
  setup() {
    const loading1 = ref(false)
    const loading2 = ref(false)
    const loading3 = ref(false)

    const { navigateBack } = useNavigation()
    const store = useStore()

    const handleLoading1 = () => {
      loading1.value = true
      setTimeout(() => {
        loading1.value = false
      }, 1000)
    }

    const handleLoading2 = () => {
      loading2.value = true
      setTimeout(() => {
        loading2.value = false
      }, 1000)
    }

    const handleLoading3 = () => {
      loading3.value = true
      setTimeout(() => {
        loading3.value = false
      }, 1000)
    }

    onMounted(() => {
      console.log('app返回的用户信息', store.getters['user/getterUserInfo'])
    })

    onActivated(() => {
      console.log('detail 的 onActivated')
    })

    return {
      loading1,
      loading2,
      loading3,
      navigateBack,
      handleLoading1,
      handleLoading2,
      handleLoading3,
    }
  },
})
</script>
<style lang="scss" scoped>
.box {
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  &.box1 {
    background: orange;
  }
  &.box2 {
    background: red;
  }
  &.box3 {
    background: #ccc;
  }
}
</style>
