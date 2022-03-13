<template>
  <div
    class="canvas-wrapper"
    :style="{
      width: width + 'px',
      height: height + 'px'
    }"
  >
    <img
      v-if="targetImage"
      class="target-image"
      :src="targetImage"
    >
    <canvas
      ref="canvas"
      class="canvas"
      :width="width"
      :height="height"
    />
    <el-button
      v-if="isShowDeleteBtn"
      class="delete-btn"
      :style="{
        left: btnPosition.left + 'px',
        top: btnPosition.top + 'px'
      }"
      @click="clearPoint"
    >删除该圈定目标</el-button>
  </div>
</template>

<script>
import CanvasDraw from './CanvasDraw'
export default {
  name: 'CanvasDraw',
  props: {
    readonly: {
      type: Boolean,
      default: true
    },
    targetImage: {
      type: String,
      default: ''
    },
    points: {
      type: Array,
      default: () => []
    },
    width: {
      type: Number,
      default: 800
    },
    height: {
      type: Number,
      default: 450
    }
  },
  data() {
    return {
      canvasDraw: null,
      isShowDeleteBtn: false,
      btnPosition: {
        left: 0,
        top: 0
      }
    }
  },
  watch: {
    'points': {
      handler: function(points) {
        if (this.canvasDraw) {
          this.canvasDraw.points = this.points || []
          if (this.canvasDraw.checkClose()) {
            this.canvasDraw.isEnd = true
          }
          this.canvasDraw.draw()
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.canvasDraw = new CanvasDraw(this.$refs.canvas, {
      readonly: this.readonly,
      width: this.width,
      height: this.height,
      points: this.points
    })

    this.canvasDraw.draw()


    this.canvasDraw.on('drawComplete', (points) => {
      this.$emit('drawComplete', points)
    })

    this.canvasDraw.on('pointChange', (points) => {
      this.$emit('pointChange', points)
    })

    document.addEventListener('keyup', this.onEnter)


    this.canvasDraw.on('clickInner', (isInner) => {
      if (isInner) {
        this.isShowDeleteBtn = true
        const { maxX, minX, maxY, minY } = this.canvasDraw.calcRectBoundary()

        this.btnPosition.left = minX + (maxX - minX) / 2 - 80
        if (minY > 60) {
          this.btnPosition.top = minY - 50
        } else {
          this.btnPosition.top = maxY + 20
        }
      } else {
        this.isShowDeleteBtn = false
      }
    })
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this.onEnter)
  },
  methods: {
    onEnter(e) {
      if (e.keyCode === 13) {
        if (this.canvasDraw.points.length >= 3) {
          this.canvasDraw.addPoint(this.canvasDraw.points[0])
        }
      }
    },
    prevStep() {
      this.canvasDraw.prevStep()
    },
    clearPoint() {
      this.canvasDraw.clearPoint()
      this.isShowDeleteBtn = false
      this.$emit('clearPoint')
    }
  }
}
</script>

<style lang="scss" scoped>
  .canvas-wrapper {
    position: relative;
    background: rgba(0,0,0,0.8);
    .target-image {
      display: block;
      width: 100%;
      height: 100%;
    }
    .canvas {
      position: absolute;
      top: 0;
      left: 0;
    }
    .delete-btn {
      position: absolute;
      width: 160px;
      height: 32px;
      padding: 0;
      margin: 0;
      line-height: 32px;
    }
  }
</style>
