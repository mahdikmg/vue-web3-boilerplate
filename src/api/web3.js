import Web3 from "web3";

// TODO: use constant for errors

export default async (currentChainId) => {
  // Check if MetaMask is installed
  if (!window.ethereum) {
    throw "404"; // MetaMask not found
  }

  if (!window.ethereum.isMetaMask) {
    throw "provider is not metamask";
  }

  // Request account access
  await window.ethereum.request({ method: "eth_requestAccounts" });

  // Create Web3 instance
  const web3 = new Web3(window.ethereum);

  // Check connection
  const isConnected = await web3.eth.net.isListening();
  if (!isConnected) {
    throw "Is not connected";
  }

  // Get network ID
  const networkId = await web3.eth.getChainId();
  if (
    currentChainId != process.env.VUE_APP_NETWORK_ID &&
    (networkId != process.env.VUE_APP_NETWORK_ID ||
      (currentChainId !== null && currentChainId !== undefined))
  ) {
    throw "400"; // Wrong network
  }

  // Get accounts
  const accounts = await web3.eth.getAccounts();
  const address = accounts[0].toString();

  // Get balance
  const balance = await web3.eth.getBalance(address);

  // Get ABI and create contract instance
  const response = await fetch(
    `${process.env.VUE_APP_PUBLIC_PATH}${process.env.VUE_APP_ABI_FILE_NAME}`
  );
  if (!response.ok) {
    throw "Couldn't fetch contract file";
  }
  const abi = await response.json();

  const smartContractInstance = new web3.eth.Contract(
    abi,
    process.env.VUE_APP_SMART_CONTRACT_ADDRESS
  );

  // Return all data
  return {
    injectedWeb3: isConnected,
    web3,
    address,
    balance,
    smartContractInstance,
  };
};
