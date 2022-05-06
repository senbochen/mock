<template>
  <div class="container-wrap">
    <p v-swiper class="ellipsis">
      <span class="animation" style="width: 860.34px"
        >和打扫我会丢OA时候地点哈搜盘都好的哈是的哈死了打哦IP的就爱搜度和艾速的哈斯U盾会死啊哦和打扫我会丢OA时候地点哈搜盘都好的哈是的哈死了打哦IP的就爱搜度和艾速的哈斯U盾会死啊哦</span
      >
    </p>
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :offset="100"
    >
      <div v-for="item in list" :key="item.id" class="child">
        <span>{{ item.title }}</span>
        <h5>{{ item.name }}</h5>
      </div>
    </van-list>
  </div>
</template>
<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
const list = ref<
  Array<{
    id?: string
    title?: string
    name?: string
  }>
>([])
const loading = ref(false)
const pageSize = ref(10)
const currentPage = ref(1)
const finished = ref(false)
const request = () => {
  loading.value = true
  try {
    axios
      .get('/api/users', {
        params: {
          currentPage: currentPage.value++,
          pageSize: pageSize.value,
        },
      })
      .then((res) => {
        list.value = res.data.users
        console.log('res.data', res.data.users)
      })
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  request()
})

const onLoad = () => {
  request()
}
</script>

<style lang="scss" scoped>
.child {
  padding: 20px 0;
}

.container-wrap {
  max-height: 300px;
  height: 100%;
  overflow: scroll;
  padding: 0 10px;
  h5 {
    font-weight: 900;
    padding: 10px 0;
    font-size: 18px;
    color: #03a9f4;
  }
}

.ellipsis {
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
