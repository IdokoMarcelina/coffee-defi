import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import BuymeACoffeeABI from '../contracts/BuymeACoffee.json';
import { CONTRACT_ADDRESS, addLiskSepoliaNetwork } from '../utils/networkConfig';

interface Memo {
  from: string;
  to: string;
  timestamp: bigint;
  name: string;
  message: string;
}

interface Web3ContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  contract: ethers.Contract | null;
  balance: string;
  loading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  buyCoffee: (name: string, message: string, amount: string) => Promise<void>;
  getMemos: () => Promise<Memo[]>;
  withdrawTips: () => Promise<void>;
  switchToLiskSepolia: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error('MetaMask is not installed!');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Check if we're on the right network (Lisk Sepolia)
      const network = await provider.getNetwork();
      if (network.chainId !== 4202n) {
        throw new Error('Please switch to Lisk Sepolia network (Chain ID: 4202)');
      }

      await provider.send('eth_requestAccounts', []);
      
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, BuymeACoffeeABI.abi, signer);
      
      // Test if contract exists
      try {
        await contract.owner();
      } catch (contractError) {
        throw new Error('Contract not deployed or not accessible on Lisk Sepolia.');
      }
      
      setProvider(provider);
      setAccount(address);
      setContract(contract);
      
      const balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance));
      
    } catch (error: any) {
      setError(error.message);
      console.error('Error connecting wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const switchToLiskSepolia = async () => {
    try {
      setLoading(true);
      setError(null);
      await addLiskSepoliaNetwork();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setContract(null);
    setBalance('0');
    setError(null);
  };

  const buyCoffee = async (name: string, message: string, amount: string) => {
    if (!contract) {
      throw new Error('Contract not connected');
    }

    try {
      setLoading(true);
      setError(null);

      const tx = await contract.buyMeCoffee(name, message, {
        value: ethers.parseEther(amount)
      });

      await tx.wait();
      
      // Update balance after transaction
      if (provider && account) {
        const newBalance = await provider.getBalance(account);
        setBalance(ethers.formatEther(newBalance));
      }
      
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getMemos = async (): Promise<Memo[]> => {
    if (!contract) {
      return [];
    }

    try {
      const memos = await contract.getMemos();
      return memos.map((memo: any) => ({
        from: memo.from,
        to: memo.to,
        timestamp: memo.timestamp,
        name: memo.name,
        message: memo.message
      }));
    } catch (error: any) {
      console.error('Error fetching memos:', error);
      return [];
    }
  };

  const withdrawTips = async () => {
    if (!contract) {
      throw new Error('Contract not connected');
    }

    try {
      setLoading(true);
      setError(null);

      const tx = await contract.withdrawTips();
      await tx.wait();
      
      // Update balance after withdrawal
      if (provider && account) {
        const newBalance = await provider.getBalance(account);
        setBalance(ethers.formatEther(newBalance));
      }
      
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check if wallet is already connected on page load
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, BuymeACoffeeABI.abi, signer);
            
            setProvider(provider);
            setAccount(address);
            setContract(contract);
            
            const balance = await provider.getBalance(address);
            setBalance(ethers.formatEther(balance));
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          connectWallet();
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  const value: Web3ContextType = {
    account,
    provider,
    contract,
    balance,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    buyCoffee,
    getMemos,
    withdrawTips,
    switchToLiskSepolia
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

declare global {
  interface Window {
    ethereum?: any;
  }
}