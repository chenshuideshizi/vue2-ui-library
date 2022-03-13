## Loading 加载

加载数据时显示动效。

### 区域加载

在容器中加载数据时显示。

- 提供了两种调用 Loading 的方法：指令和服务。对于自定义指令`v-loading`，只需要绑定`Boolean`即可。
- 默认状况下，Loading 遮罩会插入到绑定元素的子节点，通过添加`body`修饰符，可以使遮罩插入至 DOM 中的 body 上。

:::demo 

```html
<template>
    <div class="container" v-loading="loading" loading-text="拼命加载中">Hello Loading</div>
</template>

<script>
  export default {
    data() {
      return {
        loading: true
      }
    },
    mounted() {
        setTimeout(() => {
            this.loading = false
        }, 5000)
    }
  };
</script>

<style lang="less" scoped>
    .container {
        width: 500px;
        height: 500px;
        border: 1px solid #333;
        border-radius: 4px;
    }
</style>

```
:::
