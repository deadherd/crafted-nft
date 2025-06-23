const { ethers } = require('hardhat')

async function main() {
  const proxyAddress = '0x76065074344824a3201E46b84FA6611384bD7E92'
  const newPrice = ethers.parseEther('0.05')

  const MadeForRats = await ethers.getContractFactory('MadeForRats')
  const contract = await MadeForRats.attach(proxyAddress)

  await contract.setMintPrice(newPrice)
  console.log(`✅ Mint price set to ${ethers.formatEther(newPrice)} ETH`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
