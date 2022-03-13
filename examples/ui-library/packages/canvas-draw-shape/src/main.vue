<template>
  <div
    class="shape-canvas-wrapper"
    :class="{
      drawing: drawingOptions.isDrawing
    }"
    :style="{
      width: canvasWidth + 'px',
      height: canvasHeight + 'px'
    }">
    <canvas
      ref="canvas"
      class="shape-canvas"
      :width="canvasWidth"
      :height="canvasHeight"></canvas>
  </div>
</template>

<script>
import CanvasShape from './CanvasShape'
export default {
  name: 'CanvasDrawShape',
  props: {
    options: {
      type: Object,
      required: true
    },
    drawingOptions: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      canvasShape: null
    }
  },
  computed: {
    canvasWidth () {
      return this.options.canvasWidth
    },
    canvasHeight () {
      return this.options.canvasHeight
    },
    canvas () {
      return this.$refs.canvas
    }
  },
  watch: {
    options: {
      handler (val) {
        this.init()
      }
    },
    // 绘制区域的一些信息
    drawingOptions: {
      handler (val) {
        this.canvasShape.drawingOptions = { ...val }
      },
      deep: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.canvasShape = new CanvasShape(
        this.canvas,
        {
          ...this.options,
          on: {
            change: (e) => {
              this.$emit('change', e)
            },
            clickShape: (e) => {
              this.$emit('clickShape', e)
            },
            complete: (e) => {
              this.$emit('complete', e)
            },
            init: (e) => {
              this.$emit('init', e)
            }
          },
          ...this.drawingOptions
        }
      )
    },

    // 绘制中的操作：完成绘制
    complete () {
      this.canvasShape.complete()
    },
    // 绘制中的操作：撤销操作
    revoke () {
      this.canvasShape.revoke()
    },
    // 绘制中的操作：恢复操作
    recover () {
      this.canvasShape.recover()
    },
    // 绘制中的操作：清除绘制的点
    clear () {
      this.canvasShape.clear()
    },

    // 进入绘制状态 TODO:方法名有歧义
    startDraw () {
      this.canvasShape.startDraw()
    },
    // 取消绘制，进行只显示区域的状态 TODO:方法名有歧义
    cancelDraw () {
      this.canvasShape.cancelDraw()
    },
    // 手动触发重新绘制
    draw () {
      this.canvasShape.draw()
    },
    // 通过形状实现删除形状
    remove (shape) {
      this.canvasShape.remove(shape)
    }
  }
}
</script>

<style lang="less" scoped>
  .shape-canvas-wrapper {
    &.drawing {
      cursor: url("./images/mouse_pointer.png") 19 19, default;
    }
  }
</style>
