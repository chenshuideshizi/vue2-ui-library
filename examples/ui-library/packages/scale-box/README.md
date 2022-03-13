## scale-box 缩放容器

图片缩放容器

:::demo

```html
<template>
    <div style="width: 600px; height: 600px">
        <scale-box :source-src="pic">

        </scale-box>
    </div>
</template>

<script>
export default {
    data () {
        return {
            pic: require('./readme-images/pic_1.jpeg')
        }
    }
}
</script>
```
:::