import Loading from './src/main';
import directive from './src/directive';

Loading.install = function(Vue) {
    Vue.use(directive)
    Vue.component(Loading.name, Loading);
};

Loading.directive = directive

export default Loading;
