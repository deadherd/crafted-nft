const { ethers } = require('hardhat')

async function main() {
  const proxyAddress = '0x76065074344824a3201E46b84FA6611384bD7E92'
  const newName = 'Made for Rats®'
  const newSymbol = 'MFR'

  const MadeForRats = await ethers.getContractFactory('MadeForRats')
  const contract = await MadeForRats.attach(proxyAddress)

  await contract.setCollectionDetails(newName, newSymbol)
  console.log(`✅ Collection updated to ${newName} (${newSymbol})`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
