import createTransactionTracker from "@/utils/tracker";

export function useTransactionTracker(web3) {
  const tracker = createTransactionTracker(web3);

  return async (txHash) => {
    return new Promise((resolve, reject) => {
      tracker.checkTransaction(txHash, {
        onSuccess: resolve,
        onError: reject,
      });
    });
  };
}
