
import TestComp2 from './src/main';
/* istanbul ignore next */
TestComp2.install = function(Vue) {
  Vue.component(TestComp2.name, TestComp2);
};

export default TestComp2;
