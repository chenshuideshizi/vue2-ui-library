

components.json

- 组件打包时作为入口

### Webpack Build

**Entry**
- 所有组件作为入口 ./components.json
- 所有组件的入口 ./src/index.js


### Scripts

**npm run new**

创建新的组件目录

- 在 ./components.json 里添加新的组件，key: 组件名， value: 组件目录/入口
- 在 ./packages/theme-chalk/src 下创建文件 组件名.scss， 并在 ./packages/theme-chalk/src/index.scss 里引入该文件
- 在 ./examples/nav.config.json 里添加添加组件录由信息

**npm run dist**

打包

- webpack --config build/webpack.conf.js  打包所有的组件
- webpack --config build/webpack.component.js 每个组件打包成一个文件

**npm run dev**

开发模式

- node build/bin/iconInit.js 把所有的icon生成json文件到 example 根目录

## 重要的文件

**components.json**

作用：

- 该文件在 packages 文件夹下，保存了所有的 组件名及组件的相对根目录的路径

使用的场景：

- 当通过 npm run new [component-name] 创建新的组件时，会通过 components.json 判断是否已经存在相同名称的组件
- 当打包的时候会通过 components.json 来遍历打包所有的组件


参考：

从0到1搭建自己的组件(vue-code-view)库(上) https://juejin.cn/post/7025969670247153701
webpack loader 开发调试

https://webpack.docschina.org/contribute/debugging/

https://nodejs.org/dist/latest-v12.x/docs/api/debugger.html

参考:

深入浅出Webpack http://webpack.wuhaolin.cn/





