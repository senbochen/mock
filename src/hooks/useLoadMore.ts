import {
  ref,
  Ref,
  isRef,
  unref,
  UnwrapRef,
  ComputedRef,
  isProxy,
  toRaw,
} from 'vue'
import { BetterScrollOptions } from '@/components/base-scroll/scroll'

interface UseLoadMore<T> {
  requestData: (isRefresh: boolean) => void
  refreshData: () => void
  finished: Ref<boolean>
  listData: Ref<UnwrapRef<T[]>>
  firstScreenRendering: Ref<boolean>
  scrollOptions: Ref<BetterScrollOptions>
  baseScroll: Ref<any>
}

type ParamsType =
  | ComputedRef<Record<string, any>>
  | Ref<Record<string, any>>
  | Record<string, any>

const PAGE_SIZE = 20

export default <T>(
  api: (...args: any[]) => Promise<any>,
  params: ParamsType,
  requestDataCallback?: (...args: any[]) => void,
  refreshDataCallback?: () => void,
): UseLoadMore<T> => {
  const baseScroll = ref() // baseScroll 组件实例
  const finished = ref(false) // 是否全部数据加载完成
  const listData = ref<T[]>([]) // 下拉列表所绑定的数据
  const firstScreenRendering = ref(true) // 是否在首屏渲染中（用于判断第一次渲染）
  const scrollOptions = ref<BetterScrollOptions>({
    pullUpLoad: true,
    pullDownRefresh: true,
  })
  let pageSize = PAGE_SIZE
  let currentPage = 1

  const requestData = async (isRefresh = false) => {
    try {
      // 如果已经加载完全部数据则不再向服务端请求数据
      if (finished.value) {
        return
      }
      let apiParams: Record<string, any> = {}
      if (isRef(params)) {
        apiParams = unref(params)
      } else if (isProxy(params)) {
        apiParams = toRaw(params)
      } else {
        apiParams = params
      }
      const {
        data: {
          result: { items, pageCount },
        },
      } = await api({
        ...apiParams,
        pageSize,
        currentPage,
      })
      if (items && Array.isArray(items)) {
        if (isRefresh) {
          listData.value = items
        } else {
          listData.value = listData.value.concat(...items)
        }
        if (items.length < pageSize) {
          // 如果当前请求的条数不足展示的则认为数据全部加载完毕
          finished.value = true
        } else {
          finished.value = currentPage >= pageCount
        }
        currentPage++
      }
      requestDataCallback && requestDataCallback(items)
      console.log(
        '==== loadMore ====',
        listData.value,
        pageCount,
        finished.value,
      )
    } catch (error) {
      console.log('loadMore报错：', error)
      finished.value = true
      if (isRefresh) {
        // 如果是下拉刷新，则手动关闭下拉刷新的状态
        if (baseScroll.value) {
          console.log('接口请求失败，手动关闭下拉刷新')
          baseScroll.value.handleUpdatePullingDown()
        }
      }
    } finally {
      firstScreenRendering.value = false
    }
  }

  const refreshData = () => {
    pageSize = PAGE_SIZE
    currentPage = 1
    finished.value = false
    requestData(true)
    refreshDataCallback && refreshDataCallback()
  }

  return {
    finished,
    listData,
    firstScreenRendering,
    scrollOptions,
    baseScroll,
    requestData,
    refreshData,
  }
}
