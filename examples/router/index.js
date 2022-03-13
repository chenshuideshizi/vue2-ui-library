import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

import componentRoutes from './component-routes'
const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  ...componentRoutes
  // {
  //   path: '/mark-picture-readme',
  //   name: 'MarkPicture',
  //   // component: () => import(/* webpackChunkName: "mark-picture" */ '../custom-components/mark-picture/README.md') // TODO: 使用 import 会进入 loader 多次
  //   component: resolve => require(['../custom-components/mark-picture/README.md'],resolve) 
  // }
]

console.log('allRoutes', routes)

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
