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
        <FwaiButton
          :disabled="drawingOptions.isDrawing"
          @click="startDraw('default')"
          >开始绘制</FwaiButton
        >

        <FwaiButton
          :disabled="drawingOptions.isDrawing"
          @click="startDraw('red')"
          >绘制红色</FwaiButton
        >

        <FwaiButton
          :disabled="drawingOptions.isDrawing"
          @click="startDraw('green')"
          >绘制绿色</FwaiButton
        >
      </div>
      <div>
        <FwaiButton :disabled="!drawingOptions.isDrawing" @click="cancelDraw"
          >取消绘制</FwaiButton
        >

        <FwaiButton
          :disabled="!drawingOptions.isDrawing || !closeable"
          @click="complete"
          >完成</FwaiButton
        >

        <FwaiButton
          :disabled="!drawingOptions.isDrawing || historyRecordStack.length === 0"
          @click="revoke"
          >撤销</FwaiButton
        >
        <FwaiButton
          :disabled="!drawingOptions.isDrawing || revokeRecordStack.length === 0"
          @click="recover"
          >恢复</FwaiButton
        >
      </div>
    </div>
  </div>
</template>

<script>
import { shapeConfig } from './config'
export default {
  name: 'CanvasShapeDemo',
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

<style lang="less" scoped></style>
