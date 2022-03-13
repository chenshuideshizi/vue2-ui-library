<!-- from https://codepen.io/aurer/pen/jEGbA -->
<template>
  <div class="loader" title="loading…">
    <svg
      x="0px"
      y="0px"
      width="20px"
      height="20px"
      viewBox="0 0 20 20"
      style="enable-background:new 0 0 50 50;"
      xml:space="preserve"
    >
      <rect x="0" y="0" width="4" height="20" :fill="color">
        <animate attributeName="opacity" attributeType="XML" values="1; .2; 1" begin="0s" dur="0.6s" repeatCount="indefinite" />
      </rect>
      <rect x="7" y="0" width="4" height="20" :fill="color">
        <animate attributeName="opacity" attributeType="XML" values="1; .2; 1" begin="0.2s" dur="0.6s" repeatCount="indefinite" />
      </rect>
      <rect x="14" y="0" width="4" height="20" :fill="color">
        <animate attributeName="opacity" attributeType="XML" values="1; .2; 1" begin="0.4s" dur="0.6s" repeatCount="indefinite" />
      </rect>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    color: {
      type: String,
      default: '#333'
    }
  }
}
</script>

<style lang="scss" scoped>
  .loader{
    width: 20px;
    height: 20px;
    margin: auto;
  }
</style>
