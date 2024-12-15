import { createApp } from "vue";
import App from "~/App.vue";

import store from "~/store/index";
import router from "~/router/index";
import loading from "~/plugins/loading";
import notif from "~/plugins/notification";

import "~/assets/css/bootstrap-grid.min.css";
import "~/assets/css/bootstrap-utilities.min.css";

const app = createApp(App);

app.use(store);
app.use(router);
app.use(loading, {
  store: new loading.Store(),
});
app.use(notif, {
  store: new notif.Store(),
});

app.config.productionTip = false;

app.mount("#app");
