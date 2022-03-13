<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <ul>
      <li v-for="item in routerList" :key="item.name" >
        <router-link :to="item.path">{{item.name}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  computed: {
    routerList() {
      return this.$router.options.routes || []
    }
  },
  created() {
    console.log(this.$router)
  }
}
</script>
