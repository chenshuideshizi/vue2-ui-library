import components from '../ui-library/components.json'


  let componentRoutes = [];
  Object.keys(components).forEach((componentName) => {
    componentRoutes.push({
        path: componentName,
        meta: {
          name: componentName
        },
        name: 'component-' + componentName,
        component: () => import('../ui-library/packages/' + componentName + '/README.md')
    })
  });
  const routes = [
    {
          path: '/components',
          name: 'components',
          component: () => import('../views/Components.vue'),
          children: componentRoutes,
    }
  ]



export default routes;
