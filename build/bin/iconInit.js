'use strict';

/**
 * 作用：通过 icon.scss 获取所有的 icon 名称
 * 1. 读取 icon.scss 的 css 文件
 * 2. 使用 postcss 对代码进行格式化，并获取所有的 icon 名称
 * 3. 将所有的 icon 名称写入目标文件
 */

var postcss = require('postcss');
var fs = require('fs');
var path = require('path');
const resolve = p => path.resolve(__dirname, '../../', p);

var fontFile = fs.readFileSync(resolve(__dirname, './packages/styles/icon/icon.scss'), 'utf8');
var nodes = postcss.parse(fontFile).nodes;
var classList = [];

nodes.forEach((node) => {
  var selector = node.selector || '';
  var reg = new RegExp(/\.el-icon-([^:]+):before/);
  var arr = selector.match(reg);

  if (arr && arr[1]) {
    classList.push(arr[1]);
  }
});

classList.reverse(); // 希望按 css 文件顺序倒序排列

fs.writeFile(resolve('./examples/icon.json'), JSON.stringify(classList), () => {});
