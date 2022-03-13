<template>
  <div class="count-down">
    <slot>{{ formattedTime }}</slot>
  </div>
</template>

<script>
import { isSameSecond, parseTimeData, parseFormat } from './utils'
import { raf, cancelRaf } from './raf'
export default {
  name: 'CountDown',
  props: {
    millisecond: {
      type: Boolean,
      default: false
    },
    time: {
      type: [Number, String],
      default: 0
    },
    format: {
      type: String,
      default: 'HH:mm:ss'
    },
    autostart: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      remain: 0
    }
  },
  computed: {
    timeData() {
      return parseTimeData(this.remain)
    },

    formattedTime() {
      return parseFormat(this.format, this.timeData)
    }
  },
  watch: {
    time: {
      handler: 'reset',
      immediate: true
    }
  },
  activated() {
    if (this.keepAlivePaused) {
      this.counting = true
      this.keepAlivePaused = false
      this.tick()
    }
  },
  deactivated() {
    if (this.counting) {
      this.pause()
      this.keepAlivePaused = true
    }
  },
  beforeDestroy() {
    this.pause()
  },
  methods: {
    start() {
      if (this.counting) {
        return
      }

      this.counting = true
      this.endTime = Date.now() + this.remain

      this.tick()
    },
    pause() {
      this.counting = false
      cancelRaf(this.rafId)
    },
    reset() {
      this.pause()
      this.remain = +this.time

      if (this.autostart) {
        this.start()
      }
    },
    tick() {
      if (this.millisecond) {
        this.microTick()
      } else {
        this.macroTick()
      }
    },
    microTick() {
      this.rafId = raf(() => {
        if (!this.counting) {
          return
        }

        this.setRemain(this.getRemain())

        if (this.remain > 0) {
          this.microTick()
        }
      })
    },
    macroTick() {
      this.rafId = raf(() => {
        /* istanbul ignore if */
        // in case of call reset immediately after finish
        if (!this.counting) {
          return
        }

        const remain = this.getRemain()

        if (!isSameSecond(remain, this.remain) || remain === 0) {
          this.setRemain(remain)
        }

        if (this.remain > 0) {
          this.macroTick()
        }
      })
    },
    getRemain() {
      return Math.max(this.endTime - Date.now(), 0)
    },

    setRemain(remain) {
      this.remain = remain
      this.$emit('change', this.timeData)

      if (remain === 0) {
        this.pause()
        this.$emit('finish')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .count-down{
    display: inline-block;
  }
</style>
