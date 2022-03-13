<template>
  <canvas
    ref="rtspCanvas"
    class="rtst-video-style-canvas"
    :style="{
      width: width + 'px',
      height: height + 'px'
    }"
  />
</template>

<script>
import html2canvas from 'html2canvas'
export default {
  name: 'Index',
  props: {
    socketUrl: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 0
    },
    videoBufferSize: {
      type: Number,
      default: 512 * 1024
    },
    height: {
      type: Number,
      default: 0
    }


  },
  data() {
    return {
      canvas: null,
      player: null,
      currentUrl: ''
    }
  },
  watch: {
    socketUrl(val) {
      this.currentUrl = val
      this.doConnectSocket()
    }
  },
  mounted() {
    this.canvas = this.$refs.rtspCanvas
    if (this.socketUrl) {
      this.currentUrl = this.socketUrl
      this.doConnectSocket()
    }
  },
  beforeDestroy() {
    if (this.player) {
      this.player.destroy()
      this.player = null
    }
    if (this.currentUrl) {
      this.currentUrl = ''
    }
  },
  methods: {
    // stop() {
    //   if (this.player) {
    //     console.log('destroy')
    //     this.player.destroy()
    //     this.player = null
    //   }
    //   if (this.currentUrl) {
    //     this.currentUrl = ''
    //   }
    // },
    onPlay(e) {
      this.$emit('startPlay')
    },
    doConnectSocket() {
      if (!this.currentUrl) {
        return
      }

      this.player = new window.JSMpeg.Player(this.currentUrl, {
        canvas: this.canvas,
        pauseWhenHidden: false,
        audio: false,
        autoplay: true,
        loop: false,
        disableWebAssembly: true,
        onPlay: this.onPlay,
        preserveDrawingBuffer: true,
        shouldAttemptReconnect: false,
        videoBufferSize: this.videoBufferSize,
        reconnectInterval: 0

      })
      const ws = this.player.source.socket

      ws.onclose = () => {
        this.$emit('close')
      }
    },
    async screenshot() {
      const canvas = await html2canvas(document.querySelector('.rtst-video-style-canvas'))
      // 改变图片大小
      const canvasWidth = 1920
      const canvasHeight = 1080
      const canvasElem = document.createElement('canvas')
      canvasElem.setAttribute('width', canvasWidth)
      canvasElem.setAttribute('height', canvasHeight)
      const ctx = canvasElem.getContext('2d')
      ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvasWidth, canvasHeight)

      const dataUrl = canvasElem.toDataURL('image/jpeg')

      return dataUrl
    }
  }
}
</script>

<style type="text/css" lang="scss">
  .rtst-video-style {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
</style>
