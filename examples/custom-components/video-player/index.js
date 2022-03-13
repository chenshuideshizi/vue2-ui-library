import VideoPlayer from './src/main';

VideoPlayer.install = function(Vue) {
  Vue.component(VideoPlayer.name, VideoPlayer);
};

export default VideoPlayer;
