import { inject } from 'vue'
import { useStore } from 'vuex'
import { toHex } from 'web3-utils'

export function usePreTransaction() {
    const store = useStore()
    const web3 = inject('web3')
    const smartContract = inject('smartContract')

    return (method, args, payable) => {
        return new Promise((resolve, reject) => {
            web3.eth.getTransactionCount(store.state.web3.address)
                .then((nonce) => {
                    let data = smartContract.methods[method](...args).encodeABI()
                    let txnParams = {
                        "nonce": toHex(nonce),
                        "chainId": store.state.web3.networkId,
                        "from": store.state.web3.address,
                        "to": process.env.VUE_APP_SMART_CONTRACT_ADDRESS,
                        "value": payable ? payable : 0,
                        "data": data
                    }
                    resolve(txnParams)
                })
                .catch(() => {
                    reject(new Error('Error occurred'))
                })
        })
        .then(txnParams => {
            return window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [txnParams],
            })
        })
    }
}