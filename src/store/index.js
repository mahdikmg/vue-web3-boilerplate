import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        windowWidth: null,
        web3: {
            isInjected: false
        },
    },
    mutations: {
        setWindowSize: (state, payload) => {
            state.windowWidth = payload.x
        },
        registerWeb3Instance(state, payload) {
            let result = payload
            let web3Copy = state.web3
            web3Copy.address = result.address
            if (result.networkId) {
                web3Copy.networkId = result.networkId
            }
            web3Copy.isInjected = result.injectedWeb3
            state.web3 = {...web3Copy}
        },
        networkChanged: (state, networkId) => {
            let web3Copy = state.web3
            web3Copy.networkId = networkId
            state.web3 = {...web3Copy}
        },
        accountChanged: (state, address) => {
            let web3Copy = state.web3
            web3Copy.address = address
            state.web3 = {...web3Copy}
        },
        setIsInjected: (state, payload) => {
            let web3Copy = state.web3
            web3Copy.isInjected = payload
            state.web3 = {...web3Copy}
        }
    },
    actions: {
        registerWeb3({commit, state}, payload) {
            const getWeb3 = import('../api/web3')
            getWeb3
                .then(result => result.default(state.web3.networkId))
                .then(result => {
                    Vue.prototype.$web3 = result.web3
                    Vue.prototype.$smartContract = result.smartContractInstance
                    commit('registerWeb3Instance', result)
                    payload.onReady()
                })
                .catch((e) => {
                    if (e == '404') {
                        payload.notif("Metamask not found")
                    } else if (e == '400') {
                        payload.notif("Network is wrong")
                    } else {
                        payload.notif("Network error")
                    }
                })
        }
    }
})