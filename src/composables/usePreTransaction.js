import { inject } from "vue";
import { toHex } from "web3-utils";
import useWeb3Store from "../store/web3";

const usePreTransaction = () => {
  const web3Store = useWeb3Store();
  const $web3 = inject("web3");
  const $smartContract = inject("smartContract");

  return (method, args, payable) => {
    return new Promise((resolve, reject) => {
      $web3.eth
        .getTransactionCount(web3Store.address)
        .then((nonce) => {
          let data = $smartContract.methods[method](...args).encodeABI();
          let txnParams = {
            nonce: toHex(nonce),
            chainId: web3Store.networkId,
            from: web3Store.address,
            to: process.env.VUE_APP_SMART_CONTRACT_ADDRESS,
            value: payable ? payable : 0,
            data: data,
          };
          resolve(txnParams);
        })
        .catch(() => {
          reject(new Error("Error occurred"));
        });
    }).then((txnParams) => {
      return window.ethereum.request({
        method: "eth_sendTransaction",
        params: [txnParams],
      });
    });
  };
};

export default usePreTransaction;
