import { reactive } from "vue";

class LoadingState {
  constructor() {
    this.state = reactive({
      status: false,
    });
  }

  show() {
    this.state.status = true;
  }

  hide() {
    this.state.status = false;
  }
}

const loading = {
  Store: LoadingState,
  install(app, options) {
    const loadingInstance = options.store;

    app.provide("loading", loadingInstance);
  },
};

export default loading;
