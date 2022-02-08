// import Web3 from 'web3/dist/web3.min.js'
import {toHex} from 'web3-utils'

export default {
    methods: {
        preTransaction(method, args, payable) {
                    return new Promise((resolve, reject) => {
                        this.$web3.eth.getTransactionCount(this.$store.state.web3.address)
                            .then((nonce) => {
                                let data = this.$smartContract.methods[method](...args).encodeABI()
                                let txnParams = {
                                    "nonce": toHex(nonce),
                                    "chainId": this.networkId,
                                    "from": this.$store.state.web3.address,
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
}