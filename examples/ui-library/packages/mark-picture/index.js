import MarkPicture from './src/main';

MarkPicture.install = function(Vue) {
  Vue.component(MarkPicture.name, MarkPicture);
};

export default MarkPicture;
