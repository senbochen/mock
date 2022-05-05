<template>
  <div class="base-scroll" ref="wrapperRef">
    <div class="base-scroll-content" :class="scrollClassname">
      <div
        class="base-pulldown-wrapper"
        v-if="pullDownRefresh"
        ref="pulldownRef"
      >
        <slot
          name="pulldown"
          :isBeforePullDown="isBeforePullDown"
          :isPullingDown="isPullingDown"
          :isPullDownUpdating="isPullDownUpdating"
          :isPullDownThreshold="isPullDownThreshold"
        >
          <div v-show="isBeforePullDown && !isPullDownUpdating">
            <span>{{ pullingDownTxt }}</span>
          </div>
          <div v-show="!isBeforePullDown || isPullDownUpdating">
            <div v-show="isPullingDown">
              <van-loading size="20" />
            </div>
            <div v-show="!isPullingDown">
              <span>{{ pullDownRefreshSuccessTxt }}</span>
            </div>
          </div>
        </slot>
      </div>
      <div class="base-scroll-wrapper">
        <slot></slot>
      </div>
      <slot name="pullup">
        <div class="base-pullup-wrapper" v-if="pullUpLoad">
          <van-loading v-if="!finished" size="16"></van-loading>
          <span>{{ pullUpTxt }}</span>
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  computed,
  watch,
  onMounted,
  nextTick,
  onBeforeUnmount,
} from 'vue'
import BScroll from '@better-scroll/core'
import Pullup from '@better-scroll/pull-up'
import PullDown from '@better-scroll/pull-down'
import ScrollBar from '@better-scroll/scroll-bar'
import ObserveDOM from '@better-scroll/observe-dom'
import NestedScroll from '@better-scroll/nested-scroll'
import { validateType } from '@/utils/validate/base-type-validate'
import { BetterScrollOptions } from './scroll'

// 注册插件
BScroll.use(Pullup)
BScroll.use(PullDown)
BScroll.use(ScrollBar)
BScroll.use(ObserveDOM)
BScroll.use(NestedScroll as any)

const name = 'BaseSrcoll'

const VERTICAL = 'vertical'
const HORIZONTAL = 'horizontal'
const EVENT_SCROLL = 'scroll'
const EVENT_BEFORE_SCROLL_START = 'beforeScrollStart'
const EVENT_SCROLL_END = 'scrollEnd'
const SCROLL_EVENTS = [
  EVENT_SCROLL,
  EVENT_BEFORE_SCROLL_START,
  EVENT_SCROLL_END,
]
const EVENT_PULLING_UP = 'pullingUp'
const EVENT_PULLING_DOWN = 'pullingDown'
const BOUNCE_TIME = 400
const TIME_STOP = 600
const THRESHOLD = 50
const STOP = 50
const SWIPE_BOUNCE_TIME = 200
const DEFAULT_OPTIONS = {
  observeDOM: true,
  click: true,
  stopPropagation: false,
  probeType: 0,
  scrollbar: false,
  pullDownRefresh: false,
  pullUpLoad: false,
  bounceTime: BOUNCE_TIME,
  swipeBounceTime: SWIPE_BOUNCE_TIME,
}

export interface BaseScrollProps {
  options: BetterScrollOptions
  data: any[]
  direction: 'vertical' | 'horizontal'
  scrollEvents: string[]
  refreshDelay: number
  pullUpLoadingTxt: string
  pullUpOverTxt: string
  pullDownRefreshSuccessTxt: string
  pullingDownStartTxt: string
  pullingDownEndTxt: string
  finished: boolean
}

export default defineComponent({
  name,

  props: {
    // better-scroll的配置项
    options: {
      type: Object as PropType<typeof DEFAULT_OPTIONS>,
      default() {
        return {}
      },
    },
    // 绑定的data的值
    data: {
      type: Array as PropType<any[]>,
      default() {
        return []
      },
    },
    // 滚动方向
    direction: {
      type: String as PropType<'vertical' | 'horizontal'>,
      default: VERTICAL,
    },
    // 滚动事件
    scrollEvents: {
      type: Array as PropType<string[]>,
      default() {
        return SCROLL_EVENTS
      },
      validator(value: string[]) {
        return value.every((item: string) => {
          return SCROLL_EVENTS.indexOf(item) !== -1
        })
      },
    },
    // 刷新延迟时间
    refreshDelay: {
      type: Number,
      default: 20,
    },
    // 上拉加载中的文案
    pullUpLoadingTxt: {
      type: String,
      default: '加载中',
    },
    // 上拉加载没有数据的文案
    pullUpOverTxt: {
      type: String,
      default: '没有数据啦',
    },
    // 下拉刷新成功时的文案
    pullDownRefreshSuccessTxt: {
      type: String,
      default: '更新成功',
    },
    // 下拉刷新开始下拉时的文案
    pullingDownStartTxt: {
      type: String,
      default: '请继续下拉',
    },
    // 下拉刷新下拉到底时的文案
    pullingDownEndTxt: {
      type: String,
      default: '松开立即刷新',
    },
    // 是否加载完成全部数据
    finished: {
      type: Boolean,
      default: false,
    },
  },

  emits: [...SCROLL_EVENTS, EVENT_PULLING_UP, EVENT_PULLING_DOWN],

  setup(props: BaseScrollProps, { emit }) {
    let timer: unknown = null
    let stopTimer: unknown = null
    let bounceTimer: unknown = null
    let scroll: any = null
    let isPullingUp = false // 是否在上拉加载中
    const isBeforePullDown = ref(true) // 是否在下拉刷新之前
    const isPullingDown = ref(false) //是否在下拉刷新中
    const pullingDownTxt = ref(props.pullingDownStartTxt) // 下拉刷新的文案
    const isPullDownUpdating = ref(false) // 是否在下拉刷新更新中
    const isPullDownThreshold = ref(false) // 是否在下拉刷新的临界值中
    const wrapperRef = ref<HTMLElement>()
    const pulldownRef = ref<HTMLElement>()

    const scrollClassname = computed(() => {
      return {
        'horizontal-scroll-content': props.direction === HORIZONTAL,
      }
    })
    const pullUpLoad = computed(() => props.options.pullUpLoad)
    const pullDownRefresh = computed(() => props.options.pullDownRefresh)
    const pullUpTxt = computed(() =>
      pullUpLoad.value && !props.finished
        ? props.pullUpLoadingTxt
        : props.pullUpOverTxt,
    )

    watch(
      () => props.data,
      () => {
        timer && clearTimeout(timer as number)
        timer = setTimeout(() => {
          updateData()
        }, props.refreshDelay)
      },
    )

    // 更新数据
    const updateData = async () => {
      if (pullUpLoad.value && isPullingUp) {
        // 如果开启上拉加载且在加载中
        scroll.finishPullUp()
        isPullingUp = false
      }
      if (
        pullDownRefresh.value &&
        isPullingDown.value &&
        !isBeforePullDown.value
      ) {
        handleUpdatePullingDown()
      }
      if (!props.options.observeDOM) {
        refresh()
      }
    }
    // 初始化scroll
    const initScroll = () => {
      if (!wrapperRef.value) {
        return
      }

      const pullingDownOptions: Record<string, any> = {}
      if (pullDownRefresh.value) {
        pullingDownOptions.pullDownRefresh = validateType(
          pullDownRefresh.value,
          'Object',
        )
          ? pullDownRefresh.value
          : {
              threshold: THRESHOLD,
              stop: STOP,
            }
      }

      const options = Object.assign(
        {},
        DEFAULT_OPTIONS,
        {
          scrollY: props.direction === VERTICAL,
          scrollX: props.direction === HORIZONTAL,
        },
        props.options,
        pullingDownOptions,
      )
      if (!scroll) {
        scroll = new BScroll(wrapperRef.value, options)
      }

      if (pullDownRefresh.value) {
        onPullingDown()
      }

      if (pullUpLoad.value) {
        onPullingUpLoad()
      }

      listenScrollEvents()
    }
    const listenScrollEvents = () => {
      props.scrollEvents.forEach((event) => {
        scroll.on(event, (args: any) => {
          emit(event, args)
        })
      })
    }
    const onPullingUpLoad = () => {
      if (scroll) {
        scroll.on(EVENT_PULLING_UP, handlePullingUp)
      }
    }
    const handlePullingUp = () => {
      // 如果不在上拉加载中的状态且开启了上拉加载更多
      if (!isPullingUp && pullUpLoad.value && !props.finished) {
        emit(EVENT_PULLING_UP)
      }
      isPullingUp = true
    }
    const offPullingUpLoad = () => {
      if (scroll) {
        scroll.closePullUp()
        scroll.off(EVENT_PULLING_UP, handlePullingUp)
      }
    }
    const onPullingDown = () => {
      if (scroll) {
        scroll.on(EVENT_PULLING_DOWN, handlePullingDown)
        scroll.on(EVENT_SCROLL, pullDownScrollHandle)
      }
    }
    // 数据变化处理下拉刷新的回调
    const handleUpdatePullingDown = async () => {
      // 如果开启了下拉刷新且正在下拉刷新中并不在下拉刷新之前
      isPullingDown.value = false
      await new Promise((resolve: (data: any) => void) => {
        stopTimer = setTimeout(() => {
          scroll.finishPullDown()
          resolve(true)
        }, TIME_STOP)
      })
      isBeforePullDown.value = true
      bounceTimer = setTimeout(() => {
        isPullDownUpdating.value = false
      }, props.options.bounceTime || BOUNCE_TIME)
    }
    const handlePullingDown = () => {
      if (isBeforePullDown.value && !isPullingDown.value) {
        // 在下拉刷新之前且非下拉刷新中
        emit(EVENT_PULLING_DOWN)
      }
      isBeforePullDown.value = false
      isPullingDown.value = true
      isPullDownUpdating.value = true
    }
    const pullDownScrollHandle = (pos: Record<string, any>) => {
      if (!pulldownRef.value) {
        return
      }
      const elemHeight = pulldownRef.value.offsetHeight
      if (pos.y >= elemHeight) {
        pullingDownTxt.value = props.pullingDownEndTxt
        isPullDownThreshold.value = true
      } else {
        isPullDownThreshold.value = false
        pullingDownTxt.value = props.pullingDownStartTxt
      }
    }
    const offPullingDown = () => {
      if (scroll) {
        scroll.closePullDown()
        scroll.off(EVENT_PULLING_DOWN, handlePullingDown)
        scroll.off(EVENT_SCROLL, pullDownScrollHandle)
      }
    }
    const handleClearTimeout = () => {
      timer && clearTimeout(timer as number)
      stopTimer && clearTimeout(stopTimer as number)
      bounceTimer && clearTimeout(bounceTimer as number)
      bounceTimer = null
      timer = null
      stopTimer = null
    }
    // 手动刷新betterScroll
    const refresh = () => {
      scroll && scroll.refresh()
    }
    // 禁用scoll
    const disable = () => {
      scroll && scroll.disable()
    }
    // 启用
    const enable = () => {
      scroll && scroll.enable()
    }
    // 销毁
    const destroy = () => {
      scroll && scroll.destroy()
      scroll = null
    }
    // 滚动到某个位置
    const scrollTo = (args: any) => {
      scroll && scroll.scrollTo.call(scroll, args)
    }
    // 滚动到某个元素
    const scrollToElement = (args: any) => {
      scroll && scroll.scrollToElement.call(scroll, args)
    }

    onMounted(() => {
      nextTick(initScroll)
    })

    onBeforeUnmount(() => {
      if (pullUpLoad.value) {
        offPullingUpLoad()
      }
      if (pullDownRefresh.value) {
        offPullingDown()
      }
      destroy()
      handleClearTimeout()
    })

    return {
      pulldownRef,
      wrapperRef,
      isBeforePullDown,
      isPullingDown,
      pullingDownTxt,
      isPullDownUpdating,
      isPullDownThreshold,
      scrollClassname,
      pullUpLoad,
      pullDownRefresh,
      pullUpTxt,
      updateData,
      initScroll,
      onPullingUpLoad,
      offPullingUpLoad,
      onPullingDown,
      offPullingDown,
      destroy,
      handleClearTimeout,
      listenScrollEvents,
      refresh,
      disable,
      enable,
      scrollTo,
      scrollToElement,
      handlePullingUp,
      handleUpdatePullingDown,
      handlePullingDown,
      pullDownScrollHandle,
    }
  },
})
</script>

<style lang="scss" scoped>
.base-scroll {
  position: relative;
  height: 100%;
  /* overflow: hidden; */
  .base-scroll-content {
    position: relative;
    z-index: 1;
    &.horizontal-scroll-content {
      display: inline-block;
      vertical-align: top;
      .base-scroll-wrapper {
        white-space: nowrap;
      }
    }
    /* .base-scroll-wrapper {
      overflow: hidden;
    } */
  }
  .base-pulldown-wrapper {
    position: absolute;
    transform: translateY(-100%) translateZ(0);
    z-index: 0;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: #c8c9cc;
  }
  .base-pullup-wrapper {
    width: 100%;
    height: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: #c8c9cc;
    > span {
      letter-spacing: -1px;
      margin-left: 4px;
    }
  }
}
</style>
