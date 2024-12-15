const createTransactionTracker = (web3) {
    const checkTransaction = async (txHash, { onSuccess, onError }) => {
        try {
            const receipt = await web3.eth.getTransactionReceipt(txHash)
            
            if (!receipt) {
                // Transaction not yet mined, check again in 2 seconds
                setTimeout(() => checkTransaction(txHash, { onSuccess, onError }), 2000)
                return
            }

            if (receipt.status) {
                onSuccess?.(receipt)
            } else {
                onError?.(new Error('Transaction failed'))
            }
        } catch (error) {
            onError?.(error)
        }
    }

    return checkTransaction
}

export default createTransactionTracker