## MarkPicture 图片标记组件

:::demo

```html
<template>
    <mark-picture :src="pic1" :options="options" style="width: 500px; height: 400px" />
</template>

<script>
export default {
    data () {
        return {
            pic1: require("./readme-images/pic_1.jpeg"),
            options: {
                shapes: [
                    {
                        points: [
                            {x: 0.21, y: 0.416667},
                            {x: 0.382, y: 0.103333},
                            {x: 0.692, y: 0.416667},
                            {x: 0.372, y: 0.526667}
                        ],
                        shapeStyle: {
                            fillColor: 'rgba(30, 137, 22, 0.3)',
                            strokeColor: 'rgba(30, 137, 22, 0.5)',
                            lineWidth: 10
                        }
                    },
                    {
                        points: [
                            {x: 0.224, y: 0.756667},
                            {x: 0.282, y: 0.96},
                            { x: 0.926, y: 0.92 }
                        ]
                    }
                    
                ],
                shapeStyle: {
                    fillColor: 'rgba(80, 155, 253, 0.4)',
                    strokeColor: 'rgba(80, 155, 253, 0.6)',
                    lineWidth: 40
                }
            }
        }
    }
}
</script>
```
:::