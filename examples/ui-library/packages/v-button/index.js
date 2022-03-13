import VButton from './src/main';

VButton.install = function(Vue) {
  Vue.component(VButton.name, VButton);
};

export default VButton;
