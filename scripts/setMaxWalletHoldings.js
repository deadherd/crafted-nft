const { ethers } = require('hardhat')

async function main() {
  const proxyAddress = '0x76065074344824a3201E46b84FA6611384bD7E92'
  const newLimit = 3

  const MadeForRats = await ethers.getContractFactory('MadeForRats')
  const contract = await MadeForRats.attach(proxyAddress)

  await contract.setMaxWalletHoldings(newLimit)
  console.log(`✅ Wallet limit set to ${newLimit}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
