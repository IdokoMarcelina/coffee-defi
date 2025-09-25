// Network configuration for the Coffee DeFi app
export const NETWORK_CONFIG = {
  // Lisk Sepolia Network
  liskSepolia: {
    chainId: 4202,
    chainName: 'Lisk Sepolia',
    rpcUrls: ['https://rpc.sepolia-api.lisk.com'],
    blockExplorerUrls: ['https://sepolia-blockscout.lisk.com'],
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    }
  }
};

export const CONTRACT_ADDRESS = '0xe294Eaa3Fd16044f5D0eb881B8142df4880B2fe3';

// Helper function to add Lisk Sepolia network to MetaMask
export const addLiskSepoliaNetwork = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0x106A', // 4202 in hex
        chainName: 'Lisk Sepolia',
        nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: ['https://rpc.sepolia-api.lisk.com'],
        blockExplorerUrls: ['https://sepolia-blockscout.lisk.com']
      }]
    });
  } catch (error: any) {
    if (error.code === 4902) {
      console.log('Please add Lisk Sepolia network manually to MetaMask');
    }
    throw error;
  }
};