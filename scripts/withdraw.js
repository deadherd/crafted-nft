const { ethers } = require('hardhat')

async function main() {
  const proxyAddress = '0x2e51a8FdC067e415CFD5d00b9add5C6Af72d676c'
  const recipient = '0xfd0dF1cb53a9F4576D899C275928999fc73e78E1'

  const CraftedCollection = await ethers.getContractFactory('CraftedCollection')
  const contract = await CraftedCollection.attach(proxyAddress)

  await contract.withdraw(recipient)
  console.log('✅ Withdraw complete.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
