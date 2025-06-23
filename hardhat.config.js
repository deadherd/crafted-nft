require('@nomicfoundation/hardhat-toolbox')
require('@openzeppelin/hardhat-upgrades')
require('dotenv').config()

module.exports = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: {
        enabled: true,
        runs: 100,
      },
    },
  },
  networks: {
    base_sepolia: {
      url: process.env.BASE_SEPOLIA_RPC,
      chainId: 84532,
      accounts: [process.env.PRIVATE_KEY],
    },
    base: {
      url: process.env.BASE_MAINNET_RPC,
      chainId: 8453,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
}
