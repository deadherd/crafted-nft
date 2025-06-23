const { ethers } = require('hardhat')

async function main() {
  const proxyAddress = '0x76065074344824a3201E46b84FA6611384bD7E92'
  const tokenId = 1

  const MadeForRats = await ethers.getContractFactory('MadeForRats')
  const contract = await MadeForRats.attach(proxyAddress)

  const traits = await contract.getTraits(tokenId)
  console.log(`Traits for token ${tokenId}:`, traits)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
