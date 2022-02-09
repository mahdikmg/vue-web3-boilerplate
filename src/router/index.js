import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.VUE_APP_PUBLIC_PATH,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: "",
      name: "homepage",
      component: () => import("~/pages/index"),
    },
    {
      path: "*",
      name: "404",
      component: () => import("~/pages/404"),
    },
  ],
});

export default router;
