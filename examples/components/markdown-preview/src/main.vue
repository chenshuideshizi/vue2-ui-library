<template>
  <div ref="container" class="markdow-preview">

  </div>
</template>

<script>
import Vue from "vue";
export default {
  name: "MarkdownPreview",
  props: {
    codeStr: {
      type: Object,
      default: "",
    },
  },
  data() {
    return {
      instance: null,
    };
  },
  watch: {
    codeStr: {
      handler() {
        this.initInstance();
      },
    },
  },
  mounted() {
    this.renderCode();
  },
  methods: {
    evalJS (script, scope = {}) {
      debugger

      let scopeDecl = '';
      for (let variable in scope) {
        if (scope.hasOwnProperty(variable)) {
          scopeDecl += 'var ' + variable + ' = __vuerun[\'' + variable + '\'];';
        }
      }
      // 把代码 ES6模块规范 转成 CommonJS模块规范
      script = script.replace('export default', 'module.exports =');
      // 下面是按照原始创建函数的形式组装
      // http://www.w3school.com.cn/js/pro_js_functions_function_object.asp
      script = `(function(exports){var module={};module.exports=exports;${scopeDecl};${script};return module.exports.__esModule?module.exports.default:module.exports;})({})`;
      return new Function('__vuerun', 'return ' + script)(scope) || {}; // eslint-disable-line
    },
    renderCode() {
        const container = this.$refs.container
        if (this.instance) {
            this.instance.$destory()
            container.removeChild(this.instance.$el)
        }
        // const {template, script, styles} = this.parser(this.codeStr)
        let {template, script, styles} = this.codeStr
        template = template.slice(10, -11)

        console.log('template', template)
        console.log('script', script)
        console.log('styles',styles)

        const scriptData = this.evalJS(script)

        const ctor = Vue.extend({...scriptData, template: `<template><div>${template}</div></template>`});
        this.instance = new ctor().$mount();
        container.appendChild(this.instance.$el)
    },
    parser(codeStr) {
      const elem = document.createElement("div");
      console.log(codeStr.trim())
      elem.innerHTML = codeStr.trim()
      console.log('elem', elem)

      try {
        const template = elem.querySelector("template");
        const script = elem.querySelector("script");
        const styles = Array.from(elem.querySelectorAll("style")).map(
          (n) => n.innerHTML
        );
        
        return {
          template: template ? template.innerHTML : "",
          script,
          styles
        };
      } catch (error) {
        return { error };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>