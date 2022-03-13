<template>
  <div>
    <div class="main">
      <ul class="side-nav">
        <li class="nav-item" v-for="route in routes" :key="route.name">
          <router-link :to="{ name: `${route.name}` }">
            {{ route.meta.name }}</router-link>
        </li>
      </ul>
      <div class="page-component-router-view">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Components",
  data () {
    return {
      routeName: 'components'
    }
  },
  computed: {
    routes() {
      const routes = this.$router.options.routes.find(route => route.name === this.routeName);
      console.log('routes', routes)
      return routes.children;
    },
  },
  created() {
    if (this.$route.name == this.routeName) {
      this.$router.replace({name: this.routes[0].name})
    }
  }
};
</script>

<style lang="less" scoped>
.header {
  height: 100px;
}
.main {
  display: flex;

  .side-nav {
    width: 300px;
    flex-shrink: 0;
    list-style: none;
    .nav-item {
      a {
        display: block;
        height: 40px;
        color: #333;
        line-height: 40px;
        font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-weight: 400;
        text-decoration: none;
        &.active, &:hover {
          color: #409eff;
        }
      }
    }
  }
  .page-component-router-view {
    flex: 1;
    ::v-deep {
        table {
          border-collapse: collapse;
          width: 100%;
          background-color: #fff;
          font-size: 14px;
          margin-bottom: 45px;
          line-height: 1.5em;

          strong {
            font-weight: normal;
          }

          td, th {
            border-bottom: 1px solid #dcdfe6;
            padding: 15px;
            max-width: 250px;
          }

          th {
            text-align: left;
            white-space: nowrap;
            color: #909399;
            font-weight: normal;
          }

          td {
            color: #606266;
          }

          th:first-child, td:first-child {
            padding-left: 10px;
          }
        }
    }
  }
}

</style>