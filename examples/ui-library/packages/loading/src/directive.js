import Vue from 'vue';
import { getStyle, addClass, removeClass} from '@ui/utils/dom'
import LoadingComp from './main.vue';

const LoadintCtor = Vue.extend(LoadingComp)


let loadingIns
let loadingMask
let loadingMaskStyle
const loadingDirective = {}
loadingDirective.install = (Vue) => {
  // Loading  显示/隐藏 切换
  const toggleLoading = (parent, binding) => {
    if (binding.value) {
      parent.appendChild(loadingIns.$el)
      loadingIns.visible = true
      if (!['absolute', 'fixed'].includes(getStyle(parent, 'position'))) {
        addClass(parent, 'cus-loading-parent--relative')
      }
    } else {
      loadingIns.visible = false
      setTimeout(() => {
        removeClass(parent, 'cus-loading-parent--relative')
      }, 300);
    }
  }

  Vue.directive('loading', {
    bind (el, binding, vnode) {
      console.log('binding', binding)
      // 获取参数 
      const textExr = el.getAttribute('loading-text')
      const customClassExr = el.getAttribute('loading-custom-class')

      const vm = vnode.context
      loadingIns = new LoadintCtor({
        el: document.createElement('div'),
        data: {
          text: textExr,
          customClass: customClassExr
        }
      })


      binding.value && toggleLoading(el, binding)

    },
    update (el, binding) {
      console.log('update')
      loadingIns.setText(el.getAttribute('loading-text'))
      if (binding.oldValue !== binding.value) {
        toggleLoading(el, binding)
      }
    },
    unbind () {
      console.log('unbind')
      // el.instance && el.instance.$destroy();
    }
  })
}
export default loadingDirective;