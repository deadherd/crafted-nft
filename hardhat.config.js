require('@nomicfoundation/hardhat-toolbox')
require('@openzeppelin/hardhat-upgrades')
require('dotenv').config()

module.exports = {
  solidity: '0.8.24',
  networks: {
    base_sepolia: {
      url: process.env.BASE_SEPOLIA_RPC,
      chainId: 84532,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
}
