const requireFiles = require.context('@/custom-components', true, /^\.\/[\w-]+\/\w+\.md$/)
console.log(requireFiles.keys(), 'requireFile')
const routes = requireFiles.keys().reduce((acc, key) => {
  const componentNameReg = /^\.\/([\w-]+)\/\w+\.md$/;
  const componentName = key.match(componentNameReg)[1]

  acc.push({
    path: `/${componentName}`,
    name: componentName,
    // compoennt: () => import(/* webpackChunkName: "components" */ `../../custom-components/${key.slice(2)}`), // TODO: 为什么使用 import 不行
    component: (r) =>{require.ensure([], () => r(require(`../../custom-components/${key.slice(2)}`))) } 
  })
  return acc
}, [])

console.log('routes', routes)

export default routes