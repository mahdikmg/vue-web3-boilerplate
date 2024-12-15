import { defineStore } from "pinia";
import { getCurrentInstance } from "vue";

const useWeb3Store = defineStore("web3", {
  state: () => ({
    web3: {
      isInjected: false,
      address: null,
      networkId: null,
    },
  }),

  actions: {
    registerWeb3Instance(payload) {
      const result = payload;
      this.web3 = {
        ...this.web3,
        address: result.address,
        networkId: result.networkId || this.web3.networkId,
        isInjected: result.injectedWeb3,
      };
    },

    networkChanged(networkId) {
      this.web3.networkId = networkId;
    },

    accountChanged(address) {
      this.web3.address = address;
    },

    setIsInjected(payload) {
      this.web3.isInjected = payload;
    },

    async registerWeb3({ onReady, notif }) {
      try {
        const { default: web3Setup } = await import("../api/web3");
        const result = await web3Setup(this.web3.networkId);

        const app = getCurrentInstance()?.appContext.app;
        if (app) {
          app.provide("web3", result.web3);
          app.provide("smartContract", result.smartContractInstance);
        }

        this.registerWeb3Instance(result);
        onReady();
      } catch (e) {
        if (e === "404") {
          notif("Metamask not found");
        } else if (e === "400") {
          notif("Network is wrong");
        } else {
          notif("Network error");
        }
      }
    },
  },
});

export default useWeb3Store;
