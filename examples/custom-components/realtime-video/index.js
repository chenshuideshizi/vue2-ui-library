import RealtimeVideo from './src/main';

RealtimeVideo.install = function(Vue) {
  Vue.component(RealtimeVideo.name, RealtimeVideo);
};

export default RealtimeVideo;
