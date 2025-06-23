const { ethers } = require('hardhat')

async function main() {
  const proxyAddress = '0x76065074344824a3201E46b84FA6611384bD7E92'
  const MadeForRats = await ethers.getContractFactory('MadeForRats')
  const contract = await MadeForRats.attach(proxyAddress)

  /* E X A M P L E */
  const traits = {
    code: 'GENESIS',
    artVersion: 'v1.0',
    metadataURI: 'ipfs://QmT5oZQLVBHZq3F3bWJzL9ab7QQPqjAq1gCNgE3aabxve3/',
    level: 1,
    power: 50,
    rarity: 10,
  }

  await contract.updateTraits(1, traits)
  console.log('Traits updated for token 1')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
