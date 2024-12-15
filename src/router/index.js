import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_PUBLIC_PATH),
  scrollBehavior() {
    return { top: 0, left: 0 };
  },
  routes: [
    {
      path: "/",
      name: "homepage",
      component: () => import("~/pages/index"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "404",
      component: () => import("~/pages/404"),
    },
  ],
});

export default router;
