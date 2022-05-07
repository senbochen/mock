<template>
  <div class="container-wrap">
    <p v-swiper class="ellipsis">
      mirage永远的Mock,mirage永远的Mock,mirage永远的Mock,mirage永远的Mock
    </p>
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :offset="100"
    >
      <div v-for="item in list" :key="item.id" class="child">
        <p v-swiper class="ellipsis">{{ item.title }}</p>
        <h5 v-swiper class="ellipsis">{{ item.name }}</h5>
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
.shake {
  animation: swing_image 0.8s linear 0s 1 normal;
  animation-fill-mode: both;
}
.moreover-shake {
  animation: swing_image_two 1s linear;
}
@keyframes swing_image_two {
  0% {
    transform: rotate(0deg);
  }
  5% {
    transform: rotate(-5.5deg);
  }
  25% {
    transform: rotate(7deg);
  }
  45% {
    transform: rotate(-2deg);
  }
  55% {
    transform: rotate(3deg);
  }
  65% {
    transform: rotate(-1deg);
  }
  80% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

@keyframes swing_image {
  0% {
    transform: rotate(0deg);
  }
  5% {
    transform: rotate(-5.5deg);
  }
  25% {
    transform: rotate(7deg);
  }
  45% {
    transform: rotate(-2deg);
  }
  55% {
    transform: rotate(3deg);
  }
  65% {
    transform: rotate(-1deg);
  }
  80% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.animation {
  animation: marquee 4s linear infinite;
  display: block;
}
@keyframes marquee {
  0% {
    transform: translateX(0%);
  }

  100% {
    transform: translateX(-100%); //这里不是-100%！
  }
}
</style>
