import CanvasDraw from './src/main';

CanvasDraw.install = function(Vue) {
  Vue.component(CanvasDraw.name, CanvasDraw);
};

export default CanvasDraw;
