const { ethers } = require('hardhat')

async function main() {
  const proxyAddress = '0x2e51a8FdC067e415CFD5d00b9add5C6Af72d676c'
  const newName = 'Crafted Collection'
  const newSymbol = 'CRAFT'

  const CraftedCollection = await ethers.getContractFactory('CraftedCollection')
  const contract = await CraftedCollection.attach(proxyAddress)

  await contract.setCollectionDetails(newName, newSymbol)
  console.log(`✅ Collection updated to ${newName} (${newSymbol})`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
