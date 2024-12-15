import { useStore } from 'vuex'

export function useOffChain() {
    const store = useStore()

    return () => {
        let data = JSON.stringify({
            types: {
                EIP712Domain: [
                    { name: 'name', type: 'string' },
                    { name: 'version', type: 'string' },
                    { name: 'chainId', type: 'uint256' },
                    { name: 'verifyingContract', type: 'address' },
                    { name: 'salt', type: 'string' }
                ],
                OffChainMessage: [
                    { name: 'signer', type: 'address' },
                    { name: 'method', type: 'string' },
                    { name: 'object', type: 'Mail' }
                ],
                Mail: [
                    { name: 'from', type: 'address' },
                    { name: 'to', type: 'address' },
                    { name: 'contents', type: 'string' }
                ]
            },
            primaryType: 'OffChainMessage',
            domain: {
                name: 'MailSent',
                version: '1',
                chainId: '0x' + parseInt(store.state.web3.networkId).toString(16),
                verifyingContract: process.env.VUE_APP_SMART_CONTRACT_ADDRESS,
                salt: '0123456789'
            },
            message: {
                signer: store.state.web3.address,
                method: "validateMail",
                object: {
                    from: store.state.web3.address,
                    to: process.env.VUE_APP_SMART_CONTRACT_ADDRESS,
                    contents: ''
                }
            }
        })

        return window.ethereum.request({
            method: 'eth_signTypedData_v4',
            params: [store.state.web3.address, data]
        })
    }
}