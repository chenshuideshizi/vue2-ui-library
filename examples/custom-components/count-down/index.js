import CountDown from './src/main';

CountDown.install = function(Vue) {
  Vue.component(CountDown.name, CountDown);
};

export default CountDown;
