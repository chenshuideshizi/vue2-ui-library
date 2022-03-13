import CustomTable from './src/main';

CustomTable.install = function(Vue) {
  Vue.component(CustomTable.name, CustomTable);
};

export default CustomTable;
