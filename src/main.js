import Vue from "vue";
import App from "./App.vue";

import apiFactory from "./api/apiFactory";
import tracker from "./api/tracker";
import preTransaction from "./mixins/preTransaction";

import loader from './plugins/loader'
import notif from './plugins/notification'

import "../src/assets/css/bootstrap-grid.min.css";
import "../src/assets/css/bootstrap-utilities.min.css";

Vue.mixin(preTransaction);
Vue.prototype.$api = apiFactory;
Vue.prototype.$tracker = tracker;

Vue.use(loader, {
  store: new loader.Store()
});
Vue.use(notif, {
  store: new notif.Store()
});

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
