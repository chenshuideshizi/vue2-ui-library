'use strict';

/**
 * 1. 确定 components.json 存在，并且为对象
 * 2. 确定 packages/theme-chalk/src/index.scss 存在
 * 3. 确定 examples/nav.config.json 存在, 并且为对象
 */

console.log();
process.on('exit', () => {
  console.log();
});

if (!process.argv[2]) {
  console.error('[组件名]必填 - Please enter new component name');
  process.exit(1);
}

const path = require('path');
const fs = require('fs');
const fileSave = require('file-save');
const uppercamelcase = require('uppercamelcase');
const componentname = process.argv[2];
const camelCaseComponentName = uppercamelcase(componentname);
const resolve = p => path.resolve(__dirname, '../../', p);

// 创建组件需要创建的文件模板
const Files = [
  // 组件入口文件
  {
    filename: 'index.js',
    content: `
import ${camelCaseComponentName} from './src/main';
/* istanbul ignore next */
${camelCaseComponentName}.install = function(Vue) {
  Vue.component(${camelCaseComponentName}.name, ${camelCaseComponentName});
};

export default ${camelCaseComponentName};`
  },
  {
    filename: 'src/main.vue',
    content: `<template>
  <div class="${componentname}"></div>
</template>

<script>
export default {
  name: '${camelCaseComponentName}'
};
</script>`
  },
  // 组件 readme 文档
  {
    filename: 'README.md',
    content: `## ${camelCaseComponentName}`
  },
  // 组件 css 文件
  {
    filename: 'src/style.scss',
    content:''
  }
];



// 创建 package
Files.forEach(file => {
  fileSave(resolve(`./packages/${componentname}/${file.filename}`))
    .write(file.content, 'utf8')
    .end('\n');
});

console.log('DONE!');
