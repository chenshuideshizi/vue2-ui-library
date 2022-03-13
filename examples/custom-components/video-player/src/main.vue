<template>
  <div class="video-player-wrapper">
    <video
      ref="video"
      controls
      style="width: 100%; height: 100%;"
      :src="src"
      disablePictureInPicture
      v-bind="$attrs"
      :autoplay="autoplay"
      :poster="poster"
      @loadedmetadata="$emit('loadedmetadata', $event)"
    >
      Sorry, your browser doesn't support embedded videos.
    </video>
    <div v-if="showPlayBtn">
      <div
        v-if="!isPlay"
        class="play-btn-box"
        @click="play"
      >
        <img
          class="play-btn"
          src=""
        > <!-- TODO: -->
      </div>
    </div>
    <slot />

  </div>
</template>

<script>
export default {
  name: 'VideoPlayer',
  props: {
    src: {
      type: String,
      default: ''
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    poster: {
      type: String,
      default: ''
    },
    showPlayBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isPlay: false,
      removeFn: () => {}
    }
  },
  computed: {
    video() {
      return this.$refs.video
    }
  },
  watch: {
    autoplay: {
      handler(autoplay) {
        if (autoplay) {
          this.isPlay = true
        }
      },
      immediate: true
    }
  },
  mounted() {
    const $video = this.$refs.video
    $video.controlsList = 'nodownload'
    $video.oncontextmenu = function() {
      return false
    }

    const onTimeUpdate = (e) => {
      this.$emit('timeupdate', e)
    }

    const onPause = () => {
      this.isPlay = false
    }

    const onPlay = () => {
      this.isPlay = true
    }

    $video.addEventListener('timeupdate', onTimeUpdate)
    $video.addEventListener('ended', onPause)
    $video.addEventListener('pause', onPause)
    $video.addEventListener('play', onPlay)

    this.removeFn = () => {
      $video.removeEventListener('timeupdate', onTimeUpdate)
      $video.removeEventListener('ended', onPause)
      $video.removeEventListener('pause', onPause)
      $video.removeEventListener('play', onPause)
    }
  },
  beforeDestroy() {

  },
  methods: {
    play() {
      this.isPlay = true
      this.$refs.video.play()
    },
    pause() {
      this.isPlay = false
      this.$refs.video.pause()
    }
  }
}
</script>

<style lang="scss" scoped>
  .video-player-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    .play-btn-box {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      .play-btn {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: block;
        width: 80px;
        height: 80px;
      }
    }


  }
</style>
