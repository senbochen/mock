<template>
  <div class="full-page-container full-page-gray-bg">
    <van-nav-bar title="访客详情" left-arrow @click-left="goBack">
      <template #left>
        <i class="iconfont iconicon_nav_back custom-left-arrow-icon"></i>
      </template>
    </van-nav-bar>

    <div
      v-loading="dataLoading"
      kf-loading-background="#ffffff"
      kf-loading-text="请稍等"
      class="loading-wrap"
    >
      <div
        class="empty-container-wrap"
        v-if="!dataLoading && !listData.length && !intentionAnalysis"
      >
        <p class="tips">暂无访客分析，快去分享营销工具吧</p>
        <p class="btn-skip" @click="goHomePage">立即分享</p>
      </div>
      <div
        v-if="(!dataLoading && listData.length) || intentionAnalysis"
        class="loading-wrap"
      >
        <van-notice-bar
          v-if="!firstScreenRendering && !isSourceApp"
          left-icon="volume-o"
          :scrollable="false"
          background="#FFFBE8"
          color="#ED6A0C"
          style="font-size: 13px; font-weight: 400"
          text="泄露客户隐私，属于违法行为，沟通需谨慎！"
        />
        <!-- 拨号 -->
        <div
          v-if="!firstScreenRendering && !isSourceApp"
          class="call-container"
        >
          <div v-if="visitorBaseInfo" class="call-wrapper">
            <img
              v-if="iconMarkVisible"
              class="icon-mark"
              :src="
                getStaticUrl(
                  'img',
                  visitorBaseInfo.type === 'NEW'
                    ? 'icon-visitor-new.png'
                    : 'icon-visitor-private.png',
                )
              "
              alt="角标"
            />
            <van-image
              style="align-self: flex-start"
              width="52"
              height="52"
              :src="
                visitorBaseInfo?.photoUrl
                  ? visitorBaseInfo?.photoUrl
                  : '//test-static.kfang.com/kfang/marketing-tools/img/vistor-user-avatar.png'
              "
            >
              <template v-slot:error>
                <van-image
                  width="52"
                  height="52"
                  src="//test-static.kfang.com/kfang/marketing-tools/img/vistor-user-avatar.png"
                />
              </template>
            </van-image>
            <div class="user-info">
              <p class="user-name">
                {{ visitorBaseInfo.name }}
              </p>
              <div v-if="privateBtnVisible" class="to-private-wrapper">
                <span>{{ toolTipText }}</span>
                <span
                  class="to-private"
                  :style="privateBtnActiveStyle"
                  @click="handlePrivate"
                >
                  转私
                </span>
              </div>
            </div>

            <div
              class="call-btn"
              @click="handleCall"
              v-if="visitorBaseInfo.phone && !isOutReach"
            >
              <svg class="icon svg-icon call-svg" aria-hidden="true">
                <use xlink:href="#iconicon_house_call_broker"></use>
              </svg>
            </div>
          </div>
        </div>
        <div class="common-scroll-container" v-loading="firstScreenRendering">
          <!-- baseScroll 必须声明，用于在 useLoadMore 中接口请求失败手动关闭下拉刷新  -->
          <!--
        nestedScroll: {
            groupId: `nested-scroll`, // groupId is a string or number
          },
       -->
          <base-scroll
            ref="baseScroll"
            :data="listData"
            :options="{
              ...scrollOptions,
            }"
            :finished="finished"
            @pulling-up="requestData"
            @pulling-down="refreshData"
          >
            <div class="common-wrap">
              <!-- 客户分析 -->
              <div v-if="isShowCountStatistics" class="common-title">
                <p>客户分析 <span class="time">(近三个月)</span></p>
              </div>
              <div
                v-if="isShowCountStatistics"
                class="count-statistics-wrapper"
              >
                <div class="statistics-item">
                  <p>
                    <span class="count">{{
                      visitorBaseInfo?.numOfVisitHouse
                        ? visitorBaseInfo.numOfVisitHouse
                        : queryVistorId.numOfVisitHouse
                    }}</span>
                    <span class="company">套</span>
                  </p>
                  <p class="desc">浏览房源</p>
                </div>
                <div class="statistics-item">
                  <p>
                    <span class="count">{{
                      visitorBaseInfo?.numOfVisitTime
                        ? visitorBaseInfo.numOfVisitTime
                        : queryVistorId.numOfVisitTime
                    }}</span>
                    <span class="company">次</span>
                  </p>

                  <p class="desc">浏览次数</p>
                </div>
              </div>
            </div>
            <div class="common-wrap">
              <!-- 客户意向 -->
              <div v-if="intentList.length" class="common-title m-b-10">
                <p>客户意向</p>

                <ul class="tab-container">
                  <li
                    v-for="(item, index) in intentList"
                    :key="index"
                    :class="{
                      'tab-item': true,
                      'tab-item--active': tabIndex === index,
                    }"
                    @click="handleTabIndex(index, item)"
                  >
                    {{ item.name }}
                  </li>
                </ul>
              </div>
              <van-divider style="margin: 0" />
              <!-- 客户意向筛选列表 -->
              <ul v-if="activeIntentList.length" class="customer-container">
                <div class="no-vip-wrap" v-if="isLock === 'true'">
                  <i class="iconfont icondasuo"></i>
                  <span>去开通套餐，带你轻松掌握客户意向</span>
                  <p class="is-vip-button" ref="shark" @click="handleRoute">
                    我要开通
                  </p>
                </div>
                <li
                  v-for="(item, index) in activeIntentList"
                  :key="index"
                  class="customer-item"
                >
                  <p
                    v-if="(item.data && item.data.length) || item.name"
                    class="customer-title"
                  >
                    {{ item.name }}：
                  </p>

                  <div
                    style="flex: 1; overflow: hidden"
                    v-if="isLock !== 'true'"
                  >
                    <base-scroll
                      v-if="item.data && item.data.length"
                      direction="horizontal"
                      :options="{
                        click: false,
                        tap: 'tap',
                      }"
                    >
                      <ul class="customer-list">
                        <li
                          v-for="subItem in item.data"
                          :class="{ active: !!subItem.active }"
                          :key="subItem.id"
                          @tap="handleIntentFilter(subItem, item.name)"
                        >
                          {{ subItem.value }}
                          <!-- {{ subItem.valueUnit }} -->
                        </li>
                      </ul>
                    </base-scroll>
                    <span v-else>-</span>
                  </div>
                </li>
              </ul>
            </div>
            <div class="common-wrap">
              <!-- 访客足迹 -->
              <div class="common-title m-b-10">
                <p>浏览记录 <span class="time">(近三个月)</span></p>
              </div>
              <van-divider style="margin: 0" />
              <!-- 列表项 -->
              <template v-if="listData.length">
                <div
                  class="list-item-space"
                  v-for="item in listData"
                  :key="item.id"
                >
                  <div class="list-item-wrapper">
                    <div class="item-middle">
                      <div class="building-info-wrapper">
                        <div class="building-conanter">
                          <div class="building-title">
                            <p>{{ item.gardenName }}</p>
                            <svg
                              class="icon svg-icon sign-svg"
                              aria-hidden="true"
                            >
                              <use :xlink:href="getSvgName(item.type)"></use>
                            </svg>
                          </div>
                          <p class="building-price">
                            {{ item.price }}<span>{{ item.priceUnit }}</span>
                          </p>
                        </div>
                        <p class="other-info">
                          <span v-if="item.layout">
                            {{ item.layout }}
                          </span>
                          <span v-if="item.area">
                            <span v-if="item.layout">|&nbsp;</span
                            >{{ item.area }}㎡
                          </span>
                          <span v-if="item.cityName || item.regionName">
                            <span v-if="item.area">|&nbsp;</span
                            >{{ item.cityName }}&nbsp;{{ item.regionName }}
                          </span>
                        </p>
                      </div>
                      <!-- 新房特有的 -->
                      <p
                        v-if="
                          item.type === 'NEW_HOUSE' && item.haveAgent === 'NO'
                        "
                        class="new-house-desc"
                      >
                        <i class="iconfont iconicon_caveat"></i>
                        项目暂未合作，可推荐其他项目
                      </p>
                    </div>
                    <div v-if="item.numOfVisitTime" class="item-bottom">
                      <p>
                        <span>意向程度:</span>
                        <img
                          class="star-image"
                          v-for="item in Math.min(
                            5,
                            Math.max(0, item.numOfVisitTime),
                          )"
                          :key="item"
                          :src="getStaticUrl('img/many', 'icon-star-big-p.png')"
                        />
                        <!-- {{ item.numOfVisitTime }}次 -->
                      </p>
                      <!-- <p>{{ formatQuickDate(item.lastVisitTime).formatDate }}</p> -->
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </base-scroll>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  computed,
  reactive,
} from 'vue'
import { Toast, Dialog } from 'vant'
import { trackEvent } from 'vue-umeng'
import { useRoute } from 'vue-router'
import BaseScroll from '@/components/base-scroll/index.vue'
import useNavigation from '@/hooks/useNavigation'
import useLoadMore from '@/hooks/useLoadMore'
import useStore from '@/hooks/useStore'
import {
  telephoneNumberHidden,
  getStaticUrl,
  getGlobal,
  deleteStorage,
  getStorage,
  getPushNativeUrl,
} from '@/utils/tools/index'
import { formatQuickDate } from '@/utils/date/index'
import {
  queryPageForBrowseHouseResult,
  queryPageForVisitorsResult,
  UserIntentionList,
} from '@/api/visitor/response'
import {
  queryPageForBrowseHouse,
  allowToPrivate,
  getPhone,
  queryUserIntention,
  haveDailRecord,
  queryAgentType,
  queryStatistics,
  checkPrivateCustomerFlag,
  queryUserIdByPhone,
} from '@/api/visitor/index'
import {
  IntentionLabelKey,
  buildingType,
  AppData,
  IntentionEnum,
  IntentionTypeParams,
  IntentionTypeParamsMap,
  ExtendsUserIntentionListItem,
  IntentionListItem,
  IntentionListType,
} from './typings/detail'

const name = 'VisitorDetail'
const IntentionLabelEnum = {
  businessAreaLabel: '意向商圈',
  gardenLabel: '意向小区',
  layoutLabel: '意向户型',
  priceLabel: '意向价格',
}

export default defineComponent({
  name,

  components: {
    BaseScroll,
  },

  setup() {
    const { navigateBack, saveFirstRecord, navigateTo } = useNavigation()
    const route = useRoute()
    const store = useStore()
    const agentId = (store.state.user.userInfo?.agentId || '') as string // 经纪人id
    const queryPhone = (route.query?.phone || '') as string // 访问者电话号码
    const querySource = (route.query?.source || '') as string // 原生来源字段值APP
    const productCode = store.state.user.userInfo?.productCode
    const privateStatus = ref('') //拓客本 是否是私客      NORMAL("普通用户")  PRIVATE("私客")
    const visitorBaseInfo = ref<queryPageForVisitorsResult | null>(null) // 访问者的基础信息
    const isCalled = ref(false) // 是否已经拨打完电话, 只有拨通完电话后才可以转私
    let timer: any = null // 轮询查询是否可以转私的定时器
    const emptyTimer = ref<any>(null)
    const sortStatus = ref<'TIME' | 'AMOUNT'>('AMOUNT') // TIME: 浏览时间  AMOUNT:浏览数量
    const appCallBackPrivateVisible = ref(true) // 用于app端页面回调，通知是否展示转私按钮
    const tabIndex = ref(0) // 客户意向的 tabIndex
    const filterIntentParams = ref<IntentionTypeParams>({}) // 接口意向类型相关的筛选参数
    const intentList = ref<IntentionListType[]>([]) // 用户意向的数组
    const isOutReach = ref(true) // 是否是外联人员（外联人员不允许转私和拨号）
    const showPopover = ref(false)
    const userInfo = store.state.user.userInfo
    const functionKeyListEnum = ref<string[]>([])
    const dataLoading = ref(true)
    const visitorId = ref<any>('') //获取访客ID
    const intentionAnalysis = ref(false)
    const queryVistorId = reactive<{
      userId: string | number
      numOfVisitHouse?: number
      numOfVisitTime?: number
    }>({
      userId: '',
      numOfVisitHouse: 0,
      numOfVisitTime: 0,
    }) //原生跳转到这个页面从后端接口获取访客ID
    const isLock = ref<string>('')

    // 请求api的params
    const apiParams = computed(() => {
      return {
        id: visitorId.value,
        orderType: sortStatus.value,
        ...filterIntentParams.value,
      }
    })
    const {
      baseScroll,
      finished,
      firstScreenRendering,
      scrollOptions,
      listData,
      requestData,
      refreshData,
    } = useLoadMore<queryPageForBrowseHouseResult>(
      queryPageForBrowseHouse,
      apiParams,
    )

    //获取访客ID
    const isShowCountStatistics = computed(() => {
      console.log('visitorBaseInfo.value>>>>>', visitorBaseInfo.value)
      console.log('queryVistorId.numOfVisitHouse>>>>>', queryVistorId)
      if (
        visitorBaseInfo.value ||
        (queryVistorId.numOfVisitHouse && queryVistorId.numOfVisitTime)
      ) {
        return true
      } else {
        return false
      }
    })

    const goBack = () => {
      trackEvent(
        'click_client_details_return_button',
        {
          agentId: `经纪人ID:${store.state.user.userInfo?.id}`,
          eventName: '点击_访客详情页返回',
        },
        'CLK',
      )
      navigateBack()
    }

    // 获取客户意向是否上锁的字段
    const getStatisticsCount = async () => {
      try {
        dataLoading.value = true
        const {
          data: {
            result: { functionKeyList },
          },
        } = await queryStatistics()

        functionKeyListEnum.value = functionKeyList || []
        if (
          userInfo.productCode === 'TUO_KE_BEN' &&
          !functionKeyListEnum.value.includes('VISITOR_ANALYSE')
        ) {
          isLock.value = 'true'
        } else {
          isLock.value = 'false'
        }
      } catch (err) {
        console.log('获取客户意向是否上锁的字段', err)
      } finally {
        emptyTimer.value = setTimeout(() => {
          dataLoading.value = false
        }, 1000)
      }
    }

    const actions = [{ text: '按时间排序' }]
    // 当前聚焦的客户意向筛选列表
    const activeIntentList = computed(() => {
      const targetObj = intentList.value[tabIndex.value]
      if (targetObj) {
        console.log('targetObj.list----targetObj.list', targetObj.list)
        return targetObj.list || []
      } else {
        return []
      }
    })

    // 是否显示转私按钮
    const privateBtnVisible = computed(() => {
      return (
        Boolean(visitorBaseInfo.value?.phone) &&
        visitorBaseInfo.value?.type !== 'PRIVATE' &&
        privateStatus.value !== 'PRIVATE' &&
        !isOutReach.value
      )
    })

    // 角标的显示隐藏
    const iconMarkVisible = computed(() => {
      if (!visitorBaseInfo.value) {
        return false
      } else {
        const { type } = visitorBaseInfo.value
        if (type === 'NORMAL') {
          return false
        } else if (type === 'NEW') {
          return true
        } else {
          return privateBtnVisible.value
        }
      }
    })

    // 是否可以使用转私功能
    const privateBtnActiveStyle = computed(() => {
      return isCalled.value
        ? {
            color: '#05b2e6',
            background: '#effafd',
          }
        : {}
    })

    // 转私提示的文案
    const toolTipText = computed(() => {
      return isCalled.value
        ? '点击这里可以转为私客哟'
        : '与客户通话成功后即可转私'
    })

    const handlePrivateVisible = (data: { visible: boolean }) => {
      // 客户转私成功则传 false，否则传 true
      const { visible } = data
      console.log('原生通知是否转私成功', visible)
      appCallBackPrivateVisible.value = visible
    }

    // 筛选排序的文本
    const sortText = computed(() => {
      return sortStatus.value === 'TIME' ? '按时间排序' : '按浏览量排序'
    })

    // 调用原生的拨打电话
    const callNativePhone = async (bridge: any) => {
      try {
        const callPhone = await getCallNumber()
        if (callPhone) {
          trackEvent(
            'click_client_details_dial_number_button',
            {
              agentId: `经纪人ID:${store.state.user.userInfo?.id}`,
              eventName: '点击_访客详情页拨打电话',
            },
            'CLK',
          )
          bridge.call('callTel', { phoneNumer: callPhone })
          // 轮询接口查看用户是否已经拨打了电话
          checkedIsCalled()
        }
      } catch (err) {
        console.log('调用app拨打电话时获取号码报错:', err)
      }
    }

    // 拨打电话
    const handleCall = async () => {
      const global = getGlobal()
      const bridge = global.dsBridge

      if (bridge) {
        try {
          // 判断用户是否已经拨号
          const checkRes = await haveDailRecord({ id: visitorId.value })
          console.log('判断用户是否已经拨号>>>>>>>>', checkRes)
          if (checkRes.data.result === 'YES') {
            // 已经拨过号了直接调用
            callNativePhone(bridge)
          } else {
            await getCallNumber()
            Dialog.confirm({
              title: '拨号提醒',
              message:
                '客户轨迹属于你的秘密武器，与客户沟通时请勿直接说出客户轨迹以免产生投诉。',
              confirmButtonText: '拨号',
            })
              .then(() => {
                callNativePhone(bridge)
              })
              .catch(() => {
                // on cancel
              })
          }
        } catch (err) {
          console.log('判断用户是否已经拨号报错：', err)
        }
      }
    }

    // 获取基本信息
    const getStorageData = () => {
      const dataStr = getStorage('record-data')
      if (dataStr) {
        const data = JSON.parse(dataStr)
        visitorBaseInfo.value = data
        console.log('data>>>>>>>>>.', visitorBaseInfo.value)
        checkPrivateCustomer()
      }
    }

    // 获取拨号的电话
    const getCallNumber = async () => {
      try {
        const {
          data: { result },
        } = await getPhone({
          id: visitorId.value,
          phone: visitorBaseInfo.value?.phone,
        })
        const { extensionNumber, hostNumber, type } = result
        let phone = ''
        if (type === 'NUM_400') {
          phone = `${hostNumber}${extensionNumber}`
        } else {
          phone = hostNumber
        }
        return phone
      } catch (err) {
        console.log('获取拨号电话失败：', err)
        return Promise.reject(err)
      }
    }

    // 查询是否以拨打过电话，（转私按钮）
    const checkedIsCalled = async (isInterval = true) => {
      try {
        // 如果已经拨号过了就不请求接口
        if (isCalled.value) {
          return
        }
        if (isInterval) {
          if (timer) {
            clearInterval(timer)
            timer = null
          }
          timer = setInterval(async () => {
            const {
              data: { result },
            } = await allowToPrivate({ id: visitorId.value })
            if (result === 'YES') {
              isCalled.value = true
              clearInterval(timer)
              timer = null
            }
          }, 3000)
        } else {
          const {
            data: { result },
          } = await allowToPrivate({ id: visitorId.value })
          if (result === 'YES') {
            isCalled.value = true
          }
        }
      } catch (err) {
        console.log('查询是否以拨打了电话接口报错:', err)
      }
    }

    // 转私的接口
    const handlePrivate = () => {
      const global = getGlobal()
      const bridge = global.dsBridge
      if (isCalled.value) {
        if (bridge && visitorBaseInfo.value) {
          trackEvent(
            'click_client_details_smuggle_button',
            {
              agentId: `经纪人ID:${store.state.user.userInfo?.id}`,
              eventName: '点击_访客详情页转私',
            },
            'CLK',
          )
          const param = JSON.stringify({
            name: visitorBaseInfo.value.name,
            source: 'MARKETING_TOOLS',
            phone: visitorBaseInfo.value.phone,
          })
          bridge.call(
            'pushNativePage',
            {
              seq: 1,
              path:
                productCode === 'FANG_KE_BAO'
                  ? 'agent/customer/add'
                  : 'tkb.kfang.com://customer/add',
              param,
            },
            (res: AppData) => {
              const { success, message } = res
              if (!success) {
                Toast(message)
              }
            },
          )
        }
      }
    }

    // 切换排序状态
    const handleSwitchSortStatus = () => {
      if (sortStatus.value === 'TIME') {
        sortStatus.value = 'AMOUNT'
      } else {
        sortStatus.value = 'TIME'
      }
      refreshData()
    }

    // 获取svg的图标名
    const getSvgName = (type: buildingType) => {
      const map: {
        [key in buildingType]: string
      } = {
        NEW_HOUSE: '#icona-icon_visitor_newhouse',
        RENT_USED_HOUSE: '#icona-icon_visitor_cellhouse',
        SELL_USED_HOUSE: '#icona-icon_visitor_salehouse',
      }
      return map[type]
    }

    const handleTabIndex = (index: number, item: IntentionListType) => {
      const type = item.type
      // const name = type === 'BUY' ? '买房意向' : '租房意向'

      tabIndex.value = index
      // 这里直接赋值一个新的对象是因为要清除之前意向的筛选条件
      filterIntentParams.value = { intentionType: type }
      refreshData()
    }

    const setIntentList = (
      target: UserIntentionList,
      others: {
        name: string
        type: IntentionEnum
      },
    ) => {
      const list: Array<IntentionListItem> = []
      for (const [key, value] of Object.entries(target)) {
        list.push({
          name: IntentionLabelEnum[
            key as IntentionLabelKey<typeof IntentionLabelEnum>
          ],
          data: value,
        })
      }

      intentList.value.push({
        ...others,
        list,
      })
      console.log('intentList.value>>>>>', intentList.value)
    }

    // 获取用户意向列表
    const getUserIntention = async () => {
      try {
        const {
          data: { result },
        } = await queryUserIntention({
          id: visitorId.value,
        })

        const buyIntentionFlag = result.buyIntentionFlag // 是否有买房意向
        const rentIntentionFlag = result.rentIntentionFlag // 是否有租房意向
        if (buyIntentionFlag === 'YES') {
          setIntentList(result.buyIntention, {
            name: '买房意向',
            type: 'BUY',
          })
        }
        if (rentIntentionFlag === 'YES') {
          setIntentList(result.rentIntention, {
            name: '租房意向',
            type: 'RENT',
          })
        }
        const firstItem = intentList.value[0]
        if (firstItem && firstItem.type) {
          filterIntentParams.value.intentionType = firstItem.type
        }
        console.log('意向筛选', intentList.value)
      } catch (err) {
        if (querySource === 'app') {
          setIntentList(
            {
              businessAreaLabel: [],
              gardenLabel: [],
              layoutLabel: [],
              priceLabel: [],
            },
            {
              name: '买房意向',
              type: 'BUY',
            },
          )
          isLock.value = 'true'
        }

        console.log('获取用户意向列表:', err)
      }
    }

    // 处理用户意向的点击
    const handleIntentFilter = (
      subItem: ExtendsUserIntentionListItem,
      name: string,
    ) => {
      intentionAnalysis.value = true
      const map: IntentionTypeParamsMap = {
        PRICE: 'priceLabelIds',
        LAYOUT: 'layoutLabelIds',
        GARDEN: 'gardenLabelIds',
        BUSINESS_AREA: 'businessAreaLabelIds',
      }
      const { id, labelType } = subItem

      const defaultValue = filterIntentParams.value[map[labelType]]
      const click_code = {
        PRICE: {
          code: 'click_client_details_Intentional_price_button',
          name: '点击_访客详情页意向价格',
        },
        LAYOUT: {
          code: 'click_client_details_Intentional_type_button',
          name: '点击_访客详情页意向户型',
        },
        GARDEN: {
          code: 'click_client_details_Intended_community_button',
          name: '点击_访客详情页意向小区',
        },
        BUSINESS_AREA: {
          code: 'click_client_details_Intended_business_district_button',
          name: '点击_访客详情页意向商圈',
        },
      }
      trackEvent(
        click_code[labelType].code,
        {
          agentId: `经纪人ID:${store.state.user.userInfo?.id}`,
          eventName: click_code[labelType].name,
        },
        'CLK',
      )
      if (defaultValue && defaultValue.length) {
        const index = defaultValue.findIndex((item) => item === id)
        if (index > -1) {
          defaultValue.splice(index, 1)
          subItem.active = false
        } else {
          defaultValue.push(id)
          subItem.active = true
        }
        filterIntentParams.value[map[labelType]] = defaultValue
      } else {
        filterIntentParams.value[map[labelType]] = [id]
        subItem.active = true
      }

      console.log(filterIntentParams.value, name, '====筛选后的数据=====')
      refreshData()
    }

    // 获取经纪人的类型
    const getAgentType = async () => {
      try {
        const {
          data: { result },
        } = await queryAgentType()
        isOutReach.value = result === 'OUTREACH'
      } catch (err) {
        console.log('获取经纪人类型错误：', err)
      }
    }

    //通过电话号码检查是否是私客
    const checkPrivateCustomer = async () => {
      try {
        const {
          data: { result },
        } = await checkPrivateCustomerFlag({
          phone: visitorBaseInfo.value?.phone || '',
        })
        privateStatus.value = result
      } catch (error) {
        console.log(error)
      }
    }

    //跳转到聚合首页
    const goHomePage = () => {
      navigateTo({ path: '/home' }, 'replace')
    }

    //跳转到买套餐的地址
    const handleRoute = () => {
      const global = getGlobal()
      const bridge = global.dsBridge
      if (bridge) {
        const param = JSON.stringify({})
        const path = getPushNativeUrl(
          '/h5-tkb-main/mall?origin=APP&needBack=true',
        )
        bridge.call('openWeb', {
          target: path,
          param,
        })
      }
    }

    //根据手机号码获取详情
    const queryUserIdByPhoneDetail = async () => {
      try {
        if (isSourceApp.value) {
          const {
            data: { result },
          } = await queryUserIdByPhone({ phone: queryPhone })
          queryVistorId.userId = result.userId
          queryVistorId.numOfVisitHouse = result.numOfVisitHouse
          queryVistorId.numOfVisitTime = result.numOfVisitTime
          if (querySource === 'app' || querySource === 'App') {
            visitorId.value = result.userId
          }
        } else {
          console.log('不是从app进来的')
          visitorId.value = route.query?.id || ''
        }
      } catch (error) {
        console.log(error)
      } finally {
        emptyTimer.value = setTimeout(() => {
          dataLoading.value = false
        }, 1000)
      }
    }

    //原生来源字段source 是否为App
    const isSourceApp = computed(() => {
      if (querySource === 'app' || querySource === 'App') {
        return true
      } else {
        return false
      }
    })

    onMounted(async () => {
      const global = getGlobal()
      const bridge = global.dsBridge
      saveFirstRecord()
      if (bridge) {
        bridge.register('handlePrivateVisible', handlePrivateVisible)
      }

      await queryUserIdByPhoneDetail() //从app跳转过来才根据手机号码获取详情
      console.log('visitorId.value>>>>>>>>>', visitorId.value)

      visitorId.value && getStorageData() //在有visitorId的情况下，请求接口
      visitorId.value && checkedIsCalled(false) //在有visitorId的情况下，请求接口
      // 获取用户意向列表

      visitorId.value && getUserIntention() //在有visitorId的情况下，请求接口
      visitorId.value && getAgentType() //在有visitorId的情况下，请求接口
      visitorId.value && getStatisticsCount() //在有visitorId的情况下，获取客户意向是否上锁
      visitorId.value && requestData(false) //在有visitorId的情况下，请求接口
      console.log('listData.value》》》》》onMounted', listData.value)
      if (bridge) {
        bridge.register('viewWillAppear', function () {
          visitorId.value && checkPrivateCustomer() //在有visitorId的情况下，请求接口
          visitorId.value && getStatisticsCount() //在有visitorId的情况下，获取客户意向是否上锁
          console.log('viewWillAppear生命周期函数执行了')
        })
      }
    })

    onBeforeUnmount(() => {
      deleteStorage('record-data')
      if (timer) {
        clearInterval(timer)
        timer = null
      }
      emptyTimer.value && clearTimeout(emptyTimer.value)
      emptyTimer.value = null
    })

    return {
      baseScroll,
      finished,
      listData,
      scrollOptions,
      firstScreenRendering,
      visitorId,
      agentId,
      visitorBaseInfo,
      privateBtnVisible,
      isCalled,
      privateBtnActiveStyle,
      toolTipText,
      sortStatus,
      sortText,
      apiParams,
      appCallBackPrivateVisible,
      iconMarkVisible,
      tabIndex,
      filterIntentParams,
      intentList,
      activeIntentList,
      isOutReach,
      handlePrivateVisible,
      goBack,
      requestData,
      refreshData,
      telephoneNumberHidden,
      getStaticUrl,
      formatQuickDate,
      handleCall,
      getStorageData,
      handlePrivate,
      checkedIsCalled,
      handleSwitchSortStatus,
      getSvgName,
      getCallNumber,
      handleTabIndex,
      getUserIntention,
      setIntentList,
      handleIntentFilter,
      callNativePhone,
      actions,
      showPopover,
      isLock,
      goHomePage,
      handleRoute,
      isSourceApp,
      queryVistorId,
      dataLoading,
      isShowCountStatistics,
      intentionAnalysis,
    }
  },
})
</script>
<style>
.van-popover__action {
  font-size: 12px;
  width: auto;
  height: auto;
  padding: 10px 6px;
}
.van-popover__action:last-child {
  padding-top: 0;
}
[class*='van-hairline']::after {
  border: none;
}
.van-hairline--top.van-dialog__footer {
  padding: 18px 24px;
  display: flex;
  justify-content: space-between;
}
.van-hairline--top.van-dialog__footer .van-dialog__cancel {
  max-width: 120px;
  height: 42px;
  background: #edf0f2;
  border-radius: 4px;
  font-size: 15px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #050505;
  line-height: 21px;
  align-self: center;
}
.van-hairline--top.van-dialog__footer .van-dialog__confirm {
  max-width: 120px;
  height: 42px;
  background: #05b2e6;
  border-radius: 4px;
  font-size: 15px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #ffffff;
  line-height: 21px;
  align-self: center;
}
</style>
<style lang="scss" scoped>
.loading-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: auto;
}
.empty-container-wrap {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 100%;
  height: 34%;
  text-align: center;
  .tips {
    height: 21px;
    font-size: 15px;
    margin-bottom: 36px;
    font-weight: 400;
    color: #999999;
    line-height: 21px;
  }
  .btn-skip {
    width: 133px;
    height: 42px;
    background: #05b2e6;
    border-radius: 21px;
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    line-height: 42px;
    margin: auto;
  }
}
.no-vip-wrap {
  background: rgba(255, 255, 255, 0.8);
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  padding-top: 8%;
  z-index: 9999;
  .icondasuo {
    font-size: 34px;
    color: #999999;
  }
  span {
    font-size: 13px;
    font-weight: 400;
    color: #999999;
    padding: 8px 0 14px;
  }
  .is-vip-button {
    width: 133px;
    height: 38px;
    background: #05b2e6;
    border-radius: 20px;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    line-height: 38px;
  }
}
.m-b-10 {
  margin-bottom: 10px;
}
.call-container {
  /* padding: 14px 15px 0 15px; */
  margin-top: 8px;
  .call-wrapper {
    background: #fff;
    padding: 18px 14px;
    border-radius: 2px;
    display: flex;
    align-items: center;
    position: relative;
    box-shadow: 0 1px 1px 0 rgba(133, 133, 133, 0.1);
    z-index: 10;
    .icon-mark {
      position: absolute;
      width: 33px;
      height: 22px;
      top: -4px;
      left: -3px;
    }
    .user-info {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding-left: 15px;
    }
    .user-name {
      font-size: 16px;
      line-height: 22px;
      font-weight: bold;
      color: #0d171a;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .to-private-wrapper {
      margin-top: 4px;
      display: flex;
      align-items: center;
      flex-direction: column;
      .to-private {
        /* padding: 4px 15px; */
        width: 64px;
        height: 28px;
        font-size: 13px;

        background: #f6f6f6;
        border-radius: 2px;
        line-height: 28px;
        margin-right: 10px;
        color: #999999;
        transition: all 0.3s ease;
        align-self: flex-start;
        margin-top: 4px;
        text-align: center;
        font-weight: bolder;
      }
      > span {
        font-size: 12px;
        font-weight: 400;
        color: #b5bdbf;
        line-height: 17px;
        transition: color 0.3s ease;
        align-self: flex-start;
      }
    }
    .call-btn {
      display: block;
      margin-left: 80px;
      flex-shrink: 0;
    }
    .call-svg {
      width: 40px;
      height: 40px;
    }
  }
}
.common-title {
  padding-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > p {
    font-size: 15px;
    font-weight: bold;
    color: #0d171a;
    line-height: 21px;
    position: relative;
    /* &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 14px;
      border-radius: 2px;
      background: #00b9ef;
    } */
    .time {
      font-size: 12px;
      font-weight: 400;
      color: #b5bdbf;
    }
  }
  > div {
    font-size: 12px;
    font-weight: normal;
    color: #757d80;
    line-height: 17px;
    display: flex;
    align-items: center;
    > i {
      color: #bec4c6;
      margin-left: 2px;
      font-size: 12px;
      transform: scale(0.8);
    }
  }
  .tab-container {
    display: flex;
    align-items: center;
    .tab-item {
      height: 18px;
      font-size: 12px;
      font-weight: 400;
      color: #9ea8ab;
      line-height: 18px;
      transition: color 0.3s ease;
      position: relative;
      padding-right: 8px;
      &::after {
        content: '';
        width: 1px;
        height: 12px;
        background: #e6e6e6;
        position: absolute;
        right: 0;
        top: 3px;
      }
      &:nth-child(2) {
        padding-left: 8px;
      }
      &:last-child {
        &::after {
          display: none;
        }
        padding-right: 0px;
        padding-left: 8px;
      }
      &.tab-item--active {
        color: #0d171a;
      }
    }
  }
}
.count-statistics-wrapper {
  height: 80px;
  background: #fff;
  border-radius: 8px;
  position: relative;
  display: flex;
  /* margin-top: 14px; */
  &::before {
    content: '';
    width: 1px;
    height: 26px;
    background: #ebeded;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .statistics-item {
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .count {
      font-family: DINCondensed-Bold, DINCondensed;
      font-size: 24px;
      font-weight: bold;
      color: #191919;
      line-height: 31px;
    }
    .desc {
      font-size: 14px;
      font-weight: 400;
      color: #b5bdbf;
    }
    .company {
      font-size: 12px;
      padding-left: 4px;
      color: #171717;
    }
  }
}
.list-item-space {
  /* padding-top: 14px; */
  /* min-height: 126px; */
  // 这里不用 margin-top: 14px; 的原因 https://github.com/ustbhuangyi/better-scroll/issues/499
  border-bottom: 0.5px solid #eaeaea;
  &:last-child {
    border-bottom: none;
  }
  .list-item-wrapper {
    background: #fff;
    padding: 16px 0;
    position: relative;
  }
  .item-middle {
    margin-bottom: 14px;
    .building-info-wrapper {
      background-color: #fafafa;
      border-radius: 2px;
      padding: 12px;
      .other-info {
        font-size: 12px;
        line-height: 16px;
        margin-top: 4px;
        font-weight: normal;
        color: #0d171a;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .building-conanter {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .building-title {
        display: flex;
        align-items: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        > p {
          font-size: 14px;
          line-height: 20px;
          font-weight: bold;
          color: #0d171a;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-right: 5px;
        }
      }
      .building-price {
        font-size: 15px;
        line-height: 21px;
        font-weight: bold;
        color: #fc8034;
        margin-left: 12px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        > span {
          display: inline-block;
          font-size: 12px;
          line-height: 14px;
          transform: scale(0.8333);
        }
      }
    }
    .new-house-desc {
      font-size: 12px;
      font-weight: normal;
      color: #b5bdbf;
      line-height: 16px;
      padding: 6px 0 6px 0;
      /* border-bottom: 1px solid #ebeded; */
      > i {
        font-size: 12px;
        line-height: 16px;
        color: #b5bdbf;
      }
    }
  }
  .item-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    > p {
      display: flex;
      align-items: center;
      /* overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis; */
      > span {
        font-size: 12px;
        font-weight: normal;
        color: #b5bdbf;
        margin-top: 2px;
      }
      /* line-height: 17px; */
      .star-image {
        display: block;
        width: 16px;
        height: 16px;
        margin-left: 6px;
      }
    }
  }
  .sign-svg {
    min-width: 25px;
    min-height: 19px;
    width: 25px;
    height: 17px;
    transform: scale(0.8);
  }
}
.customer-container {
  position: relative;
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  padding: 16px 0 8px;
  overflow: hidden;
  .customer-item {
    width: 100%;
    display: flex;
    margin-bottom: 14px;
    .customer-title {
      font-size: 14px;
      font-weight: 400;
      color: #999999;
      align-self: center;
      white-space: nowrap;
    }
    .customer-list {
      display: flex;
      li {
        flex-shrink: 0;
        border-radius: 2px;
        padding: 0 13px;
        font-size: 12px;
        font-weight: 400;
        color: #3b3b3b;
        line-height: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        align-self: center;
        margin-right: 10px;
        height: 28px;
        /* transition: all 0.3s ease; */
        border-radius: 1px;
        border: 0.5px solid #dedede;
        &.active {
          color: #00b9ef;
          background: #effafd;
          border-color: #effafd;
          font-weight: 900;
        }
      }
    }
  }
}
.iconxiala {
  color: #9ea8ab;
  font-size: 12px;
  padding-left: 2px;
  transform: scale(0.8);
  display: inline-block;
}
.common-wrap {
  background-color: #fff;
  margin-top: 8px;
  padding: 0 18px;
}
</style>
