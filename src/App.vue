<template>
  <div id="app">
    <div v-if="!metamaskNotFound">
      <template v-if="loggedIn">
        <h1>You are logged in</h1>
      </template>
      <template v-else-if="!dontShowMetamask">
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
              <button @click="handleDisable" block>Confirm</button>
            </div>
          </template>
        </div>
      </overlay>
    </div>
    <div v-else>
      <h1>Install Metamask</h1>
    </div>

    <loader />

    <notifications />
  </div>
</template>

<script>
import { toDecimal } from "web3-utils";
import metamask from "./assets/metamask.svg";
import logo from "./assets/logo.png";
import Vue from "vue";

export default {
  name: "App",
  data() {
    return {
      metamask,
      logo,
      web3: {},
      disableAccess: false,
      type: null,
      networkName: process.env.VUE_APP_NETWORK_NAME,
      networkId: null,
      loggedIn: false,
      dontShowMetamask: false,
      metamaskNotFound: false,
    };
  },
  methods: {
    register() {
      this.$loading.show();
      this.preTransaction("methodName", ["arguments"])
        .then((txnHash) => {
          // give txnHash to tracker and set your event handlers to handle result
          this.$tracker.checkTxn(txnHash);
          this.$tracker.$on("success", (hash) => {
            // this line is important, you may have set multiple event listeners in your dApp so it is important to check txnHash and ensure about related txn result
            if (hash === txnHash) {
              this.$notif.push("Account registered successfully", "success");
              this.disableAccess = false;
              this.type = null;
              this.isRegistered = true;
              this.$loading.hide();
            }
          });
          this.$tracker.$on("failed", (hash) => {
            if (hash === txnHash) {
              this.$notif.push("Transaction reverted", "danger");
              this.$loading.hide();
            }
          });
        })
        .catch((err) => {
          this.$loading.hide();
          if (
            !err.message &&
            !err.message.includes("User denied transaction signature")
          ) {
            this.$notif.push("Connection error", "danger");
          }
        });
    },
    login() {
      this.handleMetamask(() => {
        this.loggedIn = true;
        this.$loading.hide();
      });
    },
    handleDisable() {
      this.handleMetamask(() => {
        this.loggedIn = true;
        this.disableAccess = false;
        this.type = null;
        this.$loading.hide();
      });
    },
    handleMetamask(callback) {
      this.$loading.show();
      const getWeb3 = import("./api/web3");
      getWeb3
        .then((result) => result.default(this.networkId))
        .then((result) => {
          Vue.prototype.$web3 = result.web3;
          this.$tracker.setWeb3(result.web3);
          Vue.prototype.$smartContract = result.smartContractInstance;
          this.web3 = {
            address: result.address,
            isInjected: true,
          };
          if (result.networkId) {
            this.networkId = result.networkId;
          }
          callback();
        })
        .catch((e) => {
          this.$loading.hide();
          if (e == "404") {
            this.$notif.push("Metamask not found", "danger");
          } else if (e == "400") {
            this.$notif.push("Network is wrong", "danger");
          } else {
            this.$notif.push("Network error", "danger");
          }
        });
    },
  },
  mounted() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        // because of metamask mobile we have to reload page
        location.reload();
      });
      window.ethereum.on("chainChanged", (chainId) => {
        this.networkId = toDecimal(chainId);
        if (toDecimal(chainId) == process.env.VUE_APP_NETWORK_ID) {
          this.disableAccess = false;
          this.type = null;
          this.login();
        } else {
          this.disableAccess = true;
          this.type = "network";
          this.loggedIn = false;
          this.web3 = {};
        }
      });
      if (window.ethereum.selectedAddress) {
        this.dontShowMetamask = true;
        this.login();
      }
    } else {
      this.metamaskNotFound = true;
    }
  },
  components: {
    notifications: () => import("./components/global/notifications"),
    loader: () => import("./components/global/loader"),
    overlay: () => import("./components/global/overlay"),
  },
};
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
