import { reactive } from 'vue'

class Notif {
  constructor() {
    this.state = reactive({
      notifs: [],
    })
  }

  push(msg, color) {
    this.state.notifs.push({
      msg,
      color:
        color === "danger"
          ? "red darken-3"
          : color === "success"
          ? "green darken-3"
          : "",
      show: true,
    })
    setTimeout(() => this.remove(), 5000)
  }

  remove(index = this.state.notifs.length - 1) {
    this.state.notifs[index].show = false
    this.state.notifs.splice(index, 1)
  }
}

const notif = {
  Store: Notif,
  install(app, options) {
    const notifInstance = options.store
    
    // Make the notification service available globally
    app.config.globalProperties.$notif = notifInstance
    
    // Provide the notification service for composition API usage
    app.provide('notif', notifInstance)
  }
}

export default notif
