<template>
  <div id="app">
    <div v-if="!metamaskNotFound">
      <template v-if="loggedIn">
        <router-view />
      </template>
      <template v-else-if="showMetamask">
        <div class="container">
          <div class="row">
            <div
              class="
                col-12
                d-flex
                flex-column
                align-items-center
                justify-content-center
              "
            >
              <img :src="metamask" width="150" height="150" />
              <button @click="login">Connect Metamask</button>
            </div>
          </div>
        </div>
      </template>

      <h1 v-if="err.length > 0">{{ err }}</h1>

      <overlay v-if="disableAccess && type">
        <div class="bg-white">
          <h4 class="not-margin">
            <template v-if="type === 'network'">
              Selected <b>Network</b> is wrong.
            </template>
            <template v-else-if="type === 'account'">
              You have changed Metamask active account.
            </template>
          </h4>
          <div class="my-3">
            <template v-if="type === 'network'">
              Select {{ networkName }} network
            </template>
            <template v-else-if="type === 'account'">
              If you want to continue with this account click on button,
              otherwise change your account.
            </template>
          </div>
          <template v-if="type === 'account'">
            <div class="footer-dialog">
              <button @click="login" block>Confirm</button>
            </div>
          </template>
        </div>
      </overlay>
    </div>
    <div v-else>
      <h1>Metamask not found, please install it.</h1>
    </div>

    <loading />
    <notifications />
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { toDecimal } from "web3-utils"
import metamask from "~/assets/metamask.svg"
import notifications from "./components/global/notifications"
import loading from "./components/global/loading"
import overlay from "./components/global/overlay"
import useWeb3Store from './store/web3'

const web3Store = useWeb3Store()
const $loading = inject('loading')
const $notif = inject('notif')

const disableAccess = ref(false)
const type = ref(null)
const networkName = ref(process.env.VUE_APP_NETWORK_NAME)
const showMetamask = ref(true)
const metamaskNotFound = ref(false)
const loggedIn = ref(false)
const err = ref("")

// Methods
const login = () => {
  $loading.show()
  web3Store.registerWeb3({
    notif: (msg) => {
      $loading.hide()
      err.value = msg
      $notif.push(msg, "danger")
    },
    onReady: () => {
      $loading.hide()
      loggedIn.value = true
      err.value = ""
    },
  })
}

// Lifecycle hooks
onMounted(() => {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", () => {
      location.reload()
    })
    
    window.ethereum.on("chainChanged", (chainId) => {
      web3Store.networkChanged(toDecimal(chainId))
      if (toDecimal(chainId) == process.env.VUE_APP_NETWORK_ID) {
        disableAccess.value = false
        type.value = null
        login()
      } else {
        disableAccess.value = true
        type.value = "network"
        web3Store.registerWeb3Instance({})
      }
    })
    
    if (window.ethereum.selectedAddress) {
      showMetamask.value = false
      login()
    }
  } else {
    metamaskNotFound.value = true
  }
})
</script>

<style>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.font-weight-bold {
  font-weight: bold;
}
</style>
