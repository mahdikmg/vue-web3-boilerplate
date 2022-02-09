import Vue from "vue";
import App from "~/App.vue";

import apiFactory from "~/api/apiFactory";
import tracker from "~/api/tracker";
import preTransaction from "~/mixins/preTransaction";
import store from "~/store/index";
import router from "~/router/index";
import loader from "~/plugins/loader";
import notif from "~/plugins/notification";

import "~/assets/css/bootstrap-grid.min.css";
import "~/assets/css/bootstrap-utilities.min.css";

Vue.mixin(preTransaction);
Vue.prototype.$api = apiFactory;
Vue.prototype.$tracker = tracker;

Vue.use(loader, {
  store: new loader.Store(),
});
Vue.use(notif, {
  store: new notif.Store(),
});

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  store,
  router,
}).$mount("#app");
