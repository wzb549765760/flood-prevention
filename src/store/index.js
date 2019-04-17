import Vue from 'vue'
import Vuex from 'vuex'

import fangxun from "./modules/fangxun";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    token: ''
  },
  mutations: {},
  modules: {
    fangxun: fangxun  //自定义
  }
});

export default store
