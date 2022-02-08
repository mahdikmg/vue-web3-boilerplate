import Web3 from 'web3/dist/web3.min.js'

export default (currentChainId) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async function (resolve, reject) {
        let web3js = window.web3
        if (typeof web3js !== 'undefined') {
            if (!window.web3.currentProvider.isMetaMask) {
                reject('provider is not metamask')
            } else {
                await window.ethereum.enable()
                let web3 = new Web3(window.ethereum)
                web3.eth.net.isListening().then(result => {
                    resolve({
                        injectedWeb3: result,
                        web3
                    })
                })
                    .catch(() => {
                        reject(new Error('Is not connected'))
                    })
            }
        } else {
            reject('404')
        }
    })
        .then(result => {
            return new Promise(function (resolve, reject) {
                result.web3.eth.net.getId()
                    .then(networkId => {
                        if (currentChainId == process.env.VUE_APP_NETWORK_ID || (networkId == process.env.VUE_APP_NETWORK_ID && (currentChainId === null || currentChainId === undefined))) {
                            resolve(result)
                        } else {
                            reject('400')
                        }
                    })
                    .catch(() => {
                        reject(new Error('Unable to retrieve network ID'))
                    })
            })
        })
        .then(result => {
            return new Promise(function (resolve, reject) {
                result.web3.eth.getAccounts().then(accounts => {
                    result = Object.assign({}, result, { address: accounts[0] + '' })
                    resolve(result)
                })
                    .catch(() => {
                        reject(new Error('Unable to retrieve address'))
                    })
            })
        })
        .then(result => {
            return new Promise(function (resolve, reject) {
                result.web3.eth.getBalance(result.address, (err, balance) => {
                    if (err) {
                        reject(new Error('Unable to retrieve balance for address: ' + result.address))
                    } else {
                        result = Object.assign({}, result, { balance })
                        resolve(result)
                    }
                })
            })
        })
        .then(result => {
            return new Promise(function (resolve, reject) {
                fetch(`${process.env.VUE_APP_PUBLIC_PATH}${process.env.VUE_APP_ABI_FILE_NAME}`)
                    .then(response => response.text())
                    .then(response => {
                        let smartContractInstance = new result.web3.eth.Contract(JSON.parse(response), process.env.VUE_APP_SMART_CONTRACT_ADDRESS)
                        result = Object.assign({}, result, { smartContractInstance })
                        resolve(result)
                    })
                    .catch(() => {
                        reject(new Error('could not create contract instance'))
                    })
            })
        })
}