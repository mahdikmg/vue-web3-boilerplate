import createTransactionTracker from "~/api/tracker";
import { inject } from "vue";

const useTransactionTracker = () => {
  const $web3 = inject("web3", null);
  const tracker = createTransactionTracker($web3);

  return async (txHash) => {
    return new Promise((resolve, reject) => {
      tracker.checkTransaction(txHash, {
        onSuccess: resolve,
        onError: reject,
      });
    });
  };
};

export default useTransactionTracker;
