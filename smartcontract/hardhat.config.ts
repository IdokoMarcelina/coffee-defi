const { vars } = require("hardhat/config");
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",

  networks: {
    'lisk-sepolia': {
      url: "https://rpc.sepolia-api.lisk.com",
      accounts: [vars.get("PRIVATE_KEY")],
      gasPrice: 1000000000,
    },

    'base-sepolia': {
      url: "https://sepolia.base.org",
      accounts: [vars.get("PRIVATE_KEY")],
      chainId: 84532,
    },
  },

  etherscan: {
    apiKey: vars.get("BASESCAN_API_KEY"),
    customChains: [
      {
        network: "lisk-sepolia",
        chainId: 4202,
        urls: {
          apiURL: "https://sepolia-blockscout.lisk.com/api",
          browserURL: "https://sepolia-blockscout.lisk.com"
        },
      },
      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
    ]
  },
  sourcify: {
    enabled: false
  },
};