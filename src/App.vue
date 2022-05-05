<template>
  <router-view v-slot="{ Component, route }">
    <!-- fix: ios原生侧滑返回会重新触发动画  -->
    <transition
      v-if="platform !== 'IOS'"
      :name="route.meta.transitionName || 'slide-in'"
      mode="out-in"
      @before-enter="handleBeforeEnter"
      @after-enter="handleAfterEnter"
    >
      <keep-alive :include="include">
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
    </transition>
    <keep-alive v-else :include="include">
      <component :is="Component" :key="route.fullPath" />
    </keep-alive>
  </router-view>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, onBeforeUnmount } from 'vue'
import useStore from '@/hooks/useStore'
import { getPlatform, getGlobal } from './utils/tools/index'

export default defineComponent({
  setup() {
    const store = useStore()
    const include = computed(() => store.getters['app/getterCacheModuleName'])
    const platform = getPlatform()
    let bridge: any = null

    const setAppNavBar = () => {
      const global = getGlobal()
      bridge = global.dsBridge
      if (bridge) {
        bridge.call('setNavBar', { isHidden: true })
      }
    }

    // 监听网络
    const addListenOnlineEvents = () => {
      window.addEventListener('offline', handleOffline)
    }

    const removeListenOnlineEvents = () => {
      window.removeEventListener('offline', handleOffline)
    }

    const handleOffline = () => {
      console.log('大哥，断网了')
      if (bridge) {
        // 通知app
        bridge.call('webError')
      }
    }

    const handleBeforeEnter = () => {
      store.dispatch('app/setRouteTransitionDone', false)
    }

    const handleAfterEnter = () => {
      store.dispatch('app/setRouteTransitionDone', true)
    }

    onMounted(() => {
      setAppNavBar()
      addListenOnlineEvents()
    })

    onBeforeUnmount(() => {
      removeListenOnlineEvents()
    })

    return {
      include,
      platform,
      addListenOnlineEvents,
      removeListenOnlineEvents,
      handleBeforeEnter,
      handleAfterEnter,
    }
  },
})
</script>
