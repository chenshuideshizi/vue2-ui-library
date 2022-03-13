var path = require('path');
var fs = require('fs');
var nodeExternals = require('webpack-node-externals');
var Components = require('../packages/components.json');

const resolve = p => path.resolve(__dirname, '../', p);

var utilsList = fs.readdirSync(resolve('./src/utils'));
var mixinsList = fs.readdirSync(resolve('./src/mixins'));
var transitionList = fs.readdirSync(resolve('./src/transitions'));

/**
 * externals 外部扩展
 * - 防止这些文件被打包
 */
var externals = {};
// 组件
Object.keys(Components).forEach(function(key) {
  externals[`element-ui/packages/${key}`] = `element-ui/lib/${key}`;
});

// 工具方法
utilsList.forEach(function(file) {
  file = path.basename(file, '.js');
  externals[`element-ui/src/utils/${file}`] = `element-ui/lib/utils/${file}`;
});

// Mixins
mixinsList.forEach(function(file) {
  file = path.basename(file, '.js');
  externals[`element-ui/src/mixins/${file}`] = `element-ui/lib/mixins/${file}`;
});

// transitions
transitionList.forEach(function(file) {
  file = path.basename(file, '.js');
  externals[`element-ui/src/transitions/${file}`] = `element-ui/lib/transitions/${file}`;
});

externals = [Object.assign({
  vue: 'vue'
}, externals), nodeExternals()];

exports.externals = externals;

/**
 * alias 别名
 */
exports.alias = {
  '@src': resolve('./src'),
  '@': resolve('./examples'),
  '@packages': resolve('./packages'),
  '@examples': resolve('./examples'),
  'element-ui': resolve('./'),
  '@ui': path.join(__dirname, '../examples/ui-library')
};

exports.vue = {
  root: 'Vue',
  commonjs: 'vue',
  commonjs2: 'vue',
  amd: 'vue'
};

exports.jsexclude = /node_modules|utils\/popper\.js|utils\/date\.js/;
