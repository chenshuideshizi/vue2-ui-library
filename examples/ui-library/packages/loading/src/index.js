import Vue from 'vue';
import loadingVue from './main.vue';

const LoadingConstructor = Vue.extend(loadingVue);

const defaults = {
  text: null,
  customClass: ''
};


LoadingConstructor.prototype.close = function() {
    setTimeout(() => {
        if (this.$el && this.$el.parentNode) {
            this.$el.parentNode.removeChild(this.$el);
        }
        this.$destroy();
    }, 300)
};

const Loading = (options = {}) => {
  options = Object.assign({}, defaults, options);

  if (typeof options.target === 'string') {
    options.target = document.querySelector(options.target);
  }
  options.target = options.target || document.body;


  let parent = options.body ? document.body : options.target;
  let instance = new LoadingConstructor({
    el: document.createElement('div'),
    data: options
  });

  parent.appendChild(instance.$el);
  Vue.nextTick(() => {
    instance.visible = true;
  });

  return instance;
};

export default Loading;
