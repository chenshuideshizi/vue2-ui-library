<template>
  <div>
    <CanvasDrawShape
      ref="canvasShape"
      :options="options"
      style="border: 4px solid #ccc"
      @change="onChange"
      @clickShape="onClickShape"></CanvasDrawShape>
    <div>
      <FwaiButton :disabled="options.status !== 'readonly'" @click="startDraw">
        开始绘制
      </FwaiButton>

      <FwaiButton :disabled="options.status !== 'drawing'" @click="cancelDraw">
        取消绘制
      </FwaiButton>

      <FwaiButton
        @click="complete"
        :disabled="options.status !== 'drawing' || drawingPoints.length < 3">
        完成
      </FwaiButton>

      <FwaiButton
        @click="$refs.canvasShape.revoke()"
        :disabled="options.status !== 'drawing' || drawingPoints.length === 0">
        撤销
      </FwaiButton>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CanvasShapeDemo',
  data () {
    return {
      drawingPoints: [],
      options: {
        canvasWidth: 500,
        canvasHeight: 300,
        status: 'readonly'
      }
    }
  },
  methods: {
    startDraw () {
      this.$refs.canvasShape.startDraw()
    },
    cancelDraw () {
      this.$refs.canvasShape.cancelDraw()
    },
    onChange ({ drawingPoints, status }) {
      this.options.status = status
      this.drawingPoints = drawingPoints
    },
    complete () {
      this.options.status = 'readonly'
      this.$refs.canvasShape.complete()
    },
    onClickShape (e) {
      console.log('clickShape', e)
    }
  }
}
</script>

<style lang="less" scoped></style>
