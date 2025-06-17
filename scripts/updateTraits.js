const { ethers } = require('hardhat')

async function main() {
  const proxyAddress = '0x2e51a8FdC067e415CFD5d00b9add5C6Af72d676c'
  const CraftedCollection = await ethers.getContractFactory('CraftedCollection')
  const contract = await CraftedCollection.attach(proxyAddress)

  const traits = {
    code: 'GENESIS',
    artVersion: 'v1.0',
    metadataURI: 'ipfs://QmWUAmvYFbdHGZhqvasxaCURBw4PRUUewJDmgnhPQf1Kg7/',
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
