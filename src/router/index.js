import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);
const router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      meta: {
        title: "美团系统",
      },
      component: resolve => require(['../components/meituanH5'], resolve)
    }

  ]
});
router.afterEach(route => {
  document.getElementsByTagName("title")[0].innerText = route.meta.title;
});
export default router;
