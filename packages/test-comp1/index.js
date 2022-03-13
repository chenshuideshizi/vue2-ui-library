
import TestComp1 from './src/main';
/* istanbul ignore next */
TestComp1.install = function(Vue) {
  Vue.component(TestComp1.name, TestComp1);
};

export default TestComp1;
