<template>
  <div
    class="camera-box"
    v-bind="$attrs"
    :style="{
      width: width + 'px',
      height: height + 'px'
    }"
  >
    <!-- 播放视频 -->
    <template v-if="device_rtsp_url">
      <rtsp-video
        ref="rtspVideo"
        class="dialog-video-block"
        :socket-url="device_rtsp_url"
        :width="width"
        :height="height"
        @startPlay="handleStartPlay"
      />

      <!-- 视频正在加载中 -->
      <div
        v-loading="status !== 'connected'"
        class="camera-loading"
        element-loading-text="视频加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      />
    </template>

    <!-- 视频不存在的时候 -->
    <img v-else class="video-empty-img" src=""><!-- TODO -->
  </div>
</template>

<script>
import RtspVideo from './rtsp-video'
export default {
  name: 'MonitorVideo',
  components: {
    RtspVideo
  },
  props: {
    autoPlay: {
      type: Boolean,
      default: true
    },
    deviceId: {
      type: String,
      default: ''
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
      status: '', // connected
      device_rtsp_url: '',
      timer: null,
      requestParams: {},
      requestURL: ''
    }
  },
  watch: {
    deviceId(oldVal, newVal) {
      if (newVal !== oldVal) {
        this.transformStream()
      }
    }
  },
  created() {
    if (this.autoPlay) {
      this.transformStream()
    }
  },
  beforeDestroy() {
    this.stop()
  },
  methods: {
    play() {
      this.transformStream()
    },
    stop() {
      clearTimeout(this.timer)
    },
    handleStartPlay() {
      this.status = 'connected'
      this.$emit('startPlay')
    },
    async transformStream() {
      // TODO:这需需要对视频地址进行处理
    },
    screenshot() {
      return this.$refs.rtspVideo.screenshot()
    }
  }
}
</script>

<style lang="scss" scoped>
  .camera-box {
    position: relative;
    width:650px;
    height: 366px;
    overflow: hidden;
  }
  .camera-loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .video-empty-img {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
