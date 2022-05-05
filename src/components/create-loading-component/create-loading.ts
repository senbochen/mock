import {
  h,
  VNode,
  render,
  vShow,
  withDirectives,
  reactive,
  toRefs,
  ref,
  Transition,
} from 'vue'
import {
  LoadingOptions,
  LoadingInstance,
  ComponentSetupConfig,
} from './loading'
import { Loading } from 'vant'
import { removeClass, hasClass } from '@/utils/dom'
import { isNull } from '@/utils/validate/base-type-validate'

export const createLoadingComponent = (
  options: LoadingOptions,
): LoadingInstance => {
  let vm: VNode | null = null
  const data = reactive({
    ...options,
    visible: false,
  })
  const afterLeaveFlag = ref(false)

  let afterLeaveTimer: any = null

  function destroyComponent() {
    const parent = data.parent
    if (parent) {
      // 移除父级元素的class
      if (hasClass(parent, 'kf-loading-parent--relative')) {
        removeClass(parent, 'kf-loading-parent--relative')
      }
      if (hasClass(parent, 'kf-loading-parent--hidden')) {
        removeClass(parent, 'kf-loading-parent--hidden')
      }
    }
    if (vm && vm.el && vm.el.parentNode) {
      console.log('销毁了')
      vm.el.parentNode.removeChild(vm.el)
    }
  }

  function close() {
    afterLeaveFlag.value = true

    if (afterLeaveTimer) {
      clearTimeout(afterLeaveTimer)
      afterLeaveTimer = null
    }

    afterLeaveTimer = window.setTimeout(() => {
      if (afterLeaveFlag.value) {
        afterLeaveFlag.value = false
        destroyComponent()
      }
    }, 400)

    data.visible = false
  }

  function handleAfterLeave() {
    if (!afterLeaveFlag.value) return
    afterLeaveFlag.value = false
    destroyComponent()
  }

  const componentSetupConfig: ComponentSetupConfig = {
    ...toRefs(data),
    close,
    handleAfterLeave,
  }
  const kfLoadingComponent = {
    name: 'KfLoading',
    setup() {
      return componentSetupConfig
    },
    methods: {
      getValue(value: any, defaultValue: any) {
        return isNull(value) ? defaultValue : value
      },
    },
    render() {
      const {
        color,
        text,
        vertical,
        iconSize,
        textSize,
        iconType,
        getValue,
        background,
        visible,
        handleAfterLeave,
        toast,
      } = this as Record<string, any>
      const renderVNode = withDirectives(
        h(
          'div',
          {
            class: 'kf-loading-mask',
            style: {
              backgroundColor: background || '',
            },
          },
          [
            h(
              'div',
              {
                class: 'kf-loading-container',
                style: {
                  backgroundColor: toast ? 'rgba(0,0,0,0.8)' : 'transparent',
                },
              },
              [
                h(
                  Loading,
                  {
                    color: getValue(color, '#ccc'),
                    vertical: getValue(vertical, true),
                    size: getValue(iconSize, '30'),
                    'text-size': getValue(textSize, '14'),
                    type: getValue(iconType, 'circular'),
                  },
                  {
                    default: () => text,
                  },
                ),
              ],
            ),
          ],
        ),
        [[vShow, visible]],
      )
      return h(
        Transition,
        {
          name: 'fade',
          // 如果动画时长大于400ms，则由close触发销毁事件
          onAfterLeave: handleAfterLeave,
        },
        {
          default: () => renderVNode,
        },
      )
    },
  }

  vm = h(kfLoadingComponent)
  render(vm, document.createElement('div'))

  return {
    ...componentSetupConfig,
    vm,
    get $el() {
      if (vm) {
        return vm.el as HTMLElement
      } else {
        return null
      }
    },
  }
}
