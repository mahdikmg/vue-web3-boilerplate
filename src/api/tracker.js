import Vue from 'vue'

const emitter = new Vue({
    data() {
        return {
            web3: null
        }
    },
    methods: {
        setWeb3(instance) {
            this.web3 = instance
        },
        checkTxn(txnHash) {
            this.web3.eth.getTransactionReceipt(txnHash)
                .then(response => {
                    if (response && response.status === true) {
                        this.$emit("success", txnHash)
                    } else {
                        setTimeout(() => this.checkTxn(txnHash), 2000)
                    }
                })
                .catch((err) => this.$emit("failed", err))
        }
    }
})

export default emitter
