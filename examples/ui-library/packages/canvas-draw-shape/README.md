## CanvasDrawShape

基于 Canvas 实现的图形绘制组件


### 基础用法

:::demo
```html
<template>
  <div>
    <CanvasDrawShape
      ref="canvasShape"
      :options="options"
      :drawingOptions="drawingOptions"
      style="border: 4px solid #ccc"
      @change="onChange"
      @clickShape="onClickShape"
      @complete="onComplete"></CanvasDrawShape>
    <div>
      <div>
        <VButton
          :disabled="drawingOptions.isDrawing"
          @click="startDraw('default')"
          >开始绘制</VButton
        >

        <VButton
          :disabled="drawingOptions.isDrawing"
          @click="startDraw('red')"
          >绘制红色</VButton
        >

        <VButton
          :disabled="drawingOptions.isDrawing"
          @click="startDraw('green')"
          >绘制绿色</VButton
        >
      </div>
      <div>
        <VButton :disabled="!drawingOptions.isDrawing" @click="cancelDraw"
          >取消绘制</VButton
        >

        <VButton
          :disabled="!drawingOptions.isDrawing || !closeable"
          @click="complete"
          >完成</VButton
        >

        <VButton
          :disabled="!drawingOptions.isDrawing || historyRecordStack.length === 0"
          @click="revoke"
          >撤销</VButton
        >
        <VButton
          :disabled="!drawingOptions.isDrawing || revokeRecordStack.length === 0"
          @click="recover"
          >恢复</VButton
        >
      </div>
    </div>
  </div>
</template>

<script>
const shapeConfig = {
  default: {
    pointStyle: {
      fillColor: 'rgba(255, 137, 49, 1)',
      strokeColor: 'rgba(255, 137, 49, 1)',
      radius: 2
    },
    lineStyle: {
      fillColor: 'rgba(255, 137, 49,0.4)',
      strokeColor: 'rgba(255, 137, 49, 1)',
      width: 2
    }
  },
  red: {
    pointStyle: {
      fillColor: 'rgba(161, 31, 44, 1)',
      strokeColor: 'rgba(161, 31, 44, 1)',
      radius: 2
    },
    lineStyle: {
      fillColor: 'rgba(161, 31, 44, 0.4)',
      strokeColor: 'rgba(161, 31, 44, 1)',
      width: 2
    }
  },
  blue: {
    pointStyle: {
      fillColor: 'rgba(80, 155, 253, 1)',
      strokeColor: 'rgba(80, 155, 253, 1)',
      radius: 2
    },
    lineStyle: {
      fillColor: 'rgba(80, 155, 253, 0.4)',
      strokeColor: 'rgba(80, 155, 253, 1)',
      width: 2
    }
  },
  green: {
    pointStyle: {
      fillColor: 'rgba(30, 137, 22, 1)',
      strokeColor: 'rgba(30, 137, 22, 1)',
      radius: 2
    },
    lineStyle: {
      fillColor: 'rgba(30, 137, 22, 0.4)',
      strokeColor: 'rgba(30, 137, 22, 1)',
      width: 2
    }
  }
}
export default {
  data () {
    return {
      drawingPoints: [],
      options: {
        shapesConfig: shapeConfig,
        initShapes: [
          {
            points: [
              { x: 0.2875, y: 0.020279 },
              { x: 0.909028, y: 0.059569 },
              { x: 0.952778, y: 0.774398 },
              { x: 0.327778, y: 0.808619 },
              { x: 0.2875, y: 0.020279 }
            ],
            type: 'default'
          }
        ],
        canvasWidth: 500,
        canvasHeight: 300,
        isDrawing: false
      },
      drawingOptions: {
        isDrawing: false,
        drawShapeType: 'blue'
      },
      shapes: [],
      drawingShape: null,
      historyRecordStack: [],
      revokeRecordStack: [],
      closeable: false
    }
  },
  computed: {
    canvasShape () {
      return this.$refs.canvasShape
    }
  },
  methods: {
    startDraw (type) {
      this.drawingOptions = {
        isDrawing: true,
        drawShapeType: type
      }
    },
    cancelDraw () {
      this.drawingOptions = {
        isDrawing: false
      }
    },
    onChange ({ drawingShape, shapes, historyRecordStack, revokeRecordStack, closeable }) {
      this.closeable = closeable
      this.shapes = shapes
      this.drawingShape = drawingShape
      this.historyRecordStack = historyRecordStack
      this.revokeRecordStack = revokeRecordStack
    },
    onComplete ({ points, id, name, type }) {
      this.drawingOptions = {
        isDrawing: false
      }
      console.log('points', points)
      /**
       * 对绘制的形状进行操作
       */
    },
    revoke () {
      this.canvasShape.revoke()
    },
    recover () {
      this.canvasShape.recover()
    },
    complete () {
      this.canvasShape.complete()
    },
    onClickShape ({ clickedShapes }) {
      alert('clickedShapes: ' + clickedShapes.map(shape => shape.id).join(','))
    }
  }
}
</script>
```
:::


**Props**

options: Object

| key名  | 类型    |  描述 |必需 | 默认值 |
| ----   | ----   | ---- | ---- | ----  |
| canvas |  DOM/String |  画布  | true | - |
| canvasWidth | Number | 画布宽  | true | - |
| canvasHeight | Number | 画布高  | true | - |
| shapesConfig |  Object   |   例子：{ blue: {pointStyle, lineStyle} } <br> pointStyle, lineStyle 参考 shape 类  | true | - |
| initShapes |  Array   |   初始化时的形状[{points: [], type: 'blue', name: 'blue-shape'}] | - | - |
| isDrawing |  Boolean   |   初始化时状是否为绘制状态 | - | false|
| drawShapeType |  String   |   当为绘制状态时，绘制形状的类型（与shapesConfig）对应 | - | -|

drawingOptions: Object

| key名  | 类型    |  描述 |必需 | 默认值 |
| ----   | ----   | ---- | ---- | ----  |
| isDrawing |  Boolean   |   改变当前的状态 | - | false|
| drawShapeType |  String   |   绘制的类型 | - | -|


Methods

| 方法名  | 参数    |  返回值 | 描述 |
| ----   | ----   | ---- | ---- | 
| complete  | -   |  - | 手动触发完成 |
| revoke  | -   |  - | 撤销操作 |
| recover  | -   |  - | 恢复操作 |
| clear  | -   |  - | 清空绘制的点 |

Events

| 事件名  | 参数    |  返回值 | 描述 |
| ----   | ----   | ---- | ---- | 
| change  | drawingShape<br>shapes<br> historyRecordStack<br> revokeRecordStack<br>closeable   |  - | 当添加或删除点时触发 |
| clickShape  | -   |  被点击的shape实现数组 | 当点击画布区域有形状时触发 |
| complete  | points, id, name, type  |  - | 当绘制完成后触发 |



### Shape 类

options

| 参数名  | 类型    |  描述 |必需 | 默认值 |
| ----   | ----   | ---- | ---- | ----  |
| canvas |  DOM/String |  画布  | true | - |
| canvasWidth | Number | 画布宽  | true | - |
| canvasHeight | Number | 画布高  | true | - |
| points |  Array   |   描绘的点坐标数组 | true | [] |
| type |  String   |   形状的类形（属于用户自定义参数） | - | - |
| name |  String   |   形状的名称（属于用户自定义参数） | - | - |
| id |  String   |   形状的唯标识（属于用户自定义参数），不传会自动生成 | - | - |
| pointStyle |  Object   |   边框线的样式 | - | { fillColor: 'red', strokeColor: 'red', radius: 4 } |
| lineStyle |  Object  |   边框点的样式 | - | { fillColor: 'red', strokeColor: 'red', width: 4 } |

Methods

| 方法名  | 参数    |  返回值 | 描述 |
| ----   | ----   | ---- | ---- | 
| checkInner  | {x: 0.01, y: 0.11}    |  true/false | 检测某个点是否在当前形状内部 |
| addPoint  | -   |  - | 向形状内添加点 |

