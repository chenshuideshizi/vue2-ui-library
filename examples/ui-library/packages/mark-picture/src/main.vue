<template>
  <div class="cus-mark-picture" >
    <canvas ref="canvas" class="cus-mark-picture" />
  </div>

</template>

<script>
import { loadImage, MarkPicture } from './MarkPicture.js'

export default {
  name: 'MarkPicture',
  props: {
    src: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loaded: false,
      instance: null
    }
  },
  computed: {
    canvas () {
      return this.$refs.canvas
    }
  },
  created() {
    this.genPic()
  },
  methods: {
    async genPic () {
      loadImage(this.src)
        .then(e => {
          this.instance = new MarkPicture({
            canvas: this.canvas,
            image: e.target,
            ...this.options
          })
        })
        .catch(err => {
          console.error(err)
        })

    }
  }
}
</script>

<style lang="less" scoped>
  .cus-mark-picture {
    width: 100%;
    height: 100%;
    
    .pic {
      display: block;
      width: 100%;
      height: 100%
    }
  }
</style>
