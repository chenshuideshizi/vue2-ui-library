<template>
  <div>
    <h3>使用默认的样式（不传 pointStyle 和 lineStyle 参数）</h3>
    <canvas
      ref="shapeCanvas"
      class="shape-canvas"
      :width="canvasWidth"
      :height="canvasHeight"></canvas>
    <p>点击的位置坐标: {{ clickPoint }}</p>
    <p>是否在区域内: {{ isClickInner }}</p>
  </div>
</template>

<script>
import Shape from '../ShapeClass'
export default {
  name: 'ShapeDemo1',
  data () {
    return {
      clickPoint: '-',
      isClickInner: '-',
      shapeIns: null,
      canvasWidth: 500,
      canvasHeight: 500
    }
  },
  computed: {
    canvas () {
      return this.$refs.shapeCanvas
    }
  },
  mounted () {
    this.shapeIns = new Shape({
      canvas: this.canvas,
      canvasWidth: this.canvasWidth,
      canvasHeight: this.canvasHeight,
      points: [
        { x: 0.2875, y: 0.020279 },
        { x: 0.909028, y: 0.059569 },
        { x: 0.952778, y: 0.774398 },
        { x: 0.327778, y: 0.808619 },
        { x: 0.2875, y: 0.020279 }
      ]
    })
    this.shapeIns.draw()

    this.canvas.addEventListener('click', this.onClick)
  },
  methods: {
    onClick (e) {
      this.clickPoint = { x: e.offsetX / this.canvasWidth, y: e.offsetY / this.canvasHeight }
      this.isClickInner = this.shapeIns.checkInner(this.clickPoint)
    }
  },
  beforeDestroy () {
    this.canvas.removeEventListener('click', this.onClick)
  }
}
</script>

<style lang="less" scoped>
  .shape-canvas {
    border: 4px solid #ccc;
    box-sizing: content-box;
  }
</style>
