<template>
  <div class="full-page-container">
    <van-nav-bar title="首页" left-arrow @click-left="navigateBack" />
    <div
      class="common-scroll-container full-common-padding"
      v-loading="firstScreenRendering"
    >
      <base-scroll
        v-if="listData.length"
        ref="baseScroll"
        :data="listData"
        :options="scrollOptions"
        :finished="finished"
        @pulling-up="requestData"
        @pulling-down="refreshData"
      >
        <div class="h-wrapper">
          <p>横向滚动区域</p>
          <div class="h-w-w">
            <base-scroll
              direction="horizontal"
              :options="{
                click: false,
                tap: 'tap',
              }"
            >
              <ul class="ul-list">
                <li v-for="item in 20" :key="item" @click="handleNested">
                  {{ item }}
                </li>
              </ul>
            </base-scroll>
          </div>
        </div>
        <div
          class="load-item test"
          v-for="item in listData"
          :key="item.id"
          @click="goDetail(item)"
        >
          {{ item.name }}
        </div>
      </base-scroll>
      <van-empty
        v-if="!listData.length && !firstScreenRendering"
        class="kf-common-empty"
        description="暂无数据"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onActivated } from 'vue'
import BaseScroll from '@/components/base-scroll/index.vue'
import useNavigation from '@/hooks/useNavigation'
import useLoadMore from '@/hooks/useLoadMore'
import { mockExampleLoadMoreData } from '@/api/example/index'

const PAGE_NAME = 'ExampleHome'
interface DataItemType {
  id: number
  name: string
}

export default defineComponent({
  name: PAGE_NAME,

  components: {
    BaseScroll,
  },

  setup() {
    const { saveFirstRecord, navigateBack, navigateTo } = useNavigation()

    const {
      baseScroll,
      finished,
      firstScreenRendering,
      scrollOptions,
      listData,
      requestData,
      refreshData,
    } = useLoadMore<DataItemType>(
      mockExampleLoadMoreData,
      { key: 123 },
      () => {
        console.log('加载更多的回调')
      },
      () => {
        console.log('上拉刷新的回调')
      },
    )

    const goDetail = (item: DataItemType) => {
      navigateTo({
        path: '/detail',
        query: {
          id: item.id,
        },
      })
    }

    const handleNested = () => {
      console.log('我点击了横向滚动区域')
    }

    onMounted(() => {
      console.log('home 的 onMounted')
      firstScreenRendering.value = true
      requestData(false)
      saveFirstRecord()
    })

    onActivated(() => {
      console.log('home 的 onActivated')
    })

    return {
      baseScroll,
      finished,
      listData,
      scrollOptions,
      firstScreenRendering,
      navigateBack,
      requestData,
      refreshData,
      goDetail,
      handleNested,
    }
  },
})
</script>

<style lang="scss" scoped>
.load-item {
  width: 100%;
  height: 60px;
  background: red;
  display: flex;
  justify-items: center;
  align-items: center;
  font-size: 20;
  color: #fff;
  margin-bottom: 20px;
  border-radius: 5px;
  &:last-of-type {
    margin-bottom: 0px;
  }
}
.h-wrapper {
  display: flex;
  align-items: center;
  > p {
    font-size: 14px;
    white-space: nowrap;
    margin-right: 10px;
  }
  .h-w-w {
    flex: 1;
    overflow: hidden;
  }
}
.ul-list {
  display: flex;
  overflow: hidden;
  > li {
    flex-shrink: 0;
    width: 120px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: red;
    color: #fff;
    font-size: 14px;
    margin-right: 10px;
  }
}
</style>
