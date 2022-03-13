import MarkdownPreview from './src/main';

MarkdownPreview.install = function(Vue) {
  Vue.component(MarkdownPreview.name, MarkdownPreview);
};

export default MarkdownPreview;
