/* Automatically generated by './build/bin/build-entry.js' */

import CanvasDrawShape from './canvas-draw-shape'
import VButton from './v-button'
import MarkPicture from './mark-picture'
import ScaleBox from './scale-box'
import Loading from './loading'

const components = [
  CanvasDrawShape,
  VButton,
  MarkPicture,
  ScaleBox,
  Loading
]

const install = function (Vue) {
  components.forEach(component => {
    Vue.component(component.name, component)
    if (component.directive) {
      Vue.use(component.directive)
    }
  })
}

export default {
  version: '1.0.0',
  install,
  CanvasDrawShape,
  VButton,
  MarkPicture,
  ScaleBox,
  Loading
}