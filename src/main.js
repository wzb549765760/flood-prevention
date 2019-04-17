// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import store from './store'
import 'vue-layer-mobile/need/layer.css'
import layer from 'vue-layer-mobile'
import axios from 'axios'
import $ from 'jquery'
import elementui from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(elementui)
Vue.use(layer)
Vue.prototype.$ajax = axios
Vue.use(Vuex);
Vue.config.productionTip = false;
axios.defaults.withCredentials = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
});
