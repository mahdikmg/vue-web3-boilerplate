<template>
  <div id="app">
    <div v-if="!metamaskNotFound">
      <template v-if="loggedIn">
        <router-view />
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
      <h1>Install Metamask</h1>
    </div>

    <loader />

    <notifications />
  </div>
</template>

<script>
import { toDecimal } from "web3-utils";
import metamask from "~/assets/metamask.svg";
import logo from "~/assets/logo.png";

export default {
  name: "App",
  data() {
    return {
      metamask,
      logo,
      disableAccess: false,
      type: null,
      networkName: process.env.VUE_APP_NETWORK_NAME,
      dontShowMetamask: false,
      metamaskNotFound: false,
      loggedIn: false,
      err: "",
    };
  },
  methods: {
    handleResize() {
      this.$store.commit("setWindowSize", {
        x: window.innerWidth,
        y: window.innerHeight,
      });
    },
    exampleTransaction() {
      this.$loading.show();
      this.preTransaction("methodName", ["arguments"])
        .then((txnHash) => {
          // give txnHash to tracker and set your event handlers to handle result
          this.$tracker.checkTxn(txnHash);
          this.$tracker.$on("success", (hash) => {
            // this line is important, you may have set multiple event listeners in your dApp so it is important to check txnHash and ensure about related txn result
            if (hash === txnHash) {
              this.$notif.push("Successfully done", "success");
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
      this.$loading.show();
      this.$store.dispatch("registerWeb3", {
        notif: (msg) => {
          this.$loading.hide();
          this.err = msg;
          this.$notif.push(msg, "danger");
        },
        onReady: () => {
          this.$tracker.setWeb3(this.$web3);
          this.$loading.hide();
          this.loggedIn = true;
          this.err = "";
        },
      });
    },
  },
  mounted() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        // if (this.$store.state.web3.isInjected) {
        // because of metamask mobile version we have to reload page
        location.reload();
        // }
      });
      window.ethereum.on("chainChanged", (chainId) => {
        // if (this.$store.state.web3.isInjected) {
        this.$store.commit("networkChanged", toDecimal(chainId));
        if (toDecimal(chainId) == process.env.VUE_APP_NETWORK_ID) {
          this.disableAccess = false;
          this.type = null;
          this.login();
        } else {
          this.disableAccess = true;
          this.type = "network";
          this.$store.commit("registerWeb3Instance", {});
        }
        // }
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
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
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
