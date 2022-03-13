import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import  MarkdowPreview  from './components/markdown-preview'
Vue.use(MarkdowPreview)

import demoBlock from './components/demo-block';
Vue.component('demo-block', demoBlock);

import UiLibrary from './ui-library/packages'
Vue.use(UiLibrary)


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
