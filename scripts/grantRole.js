const { ethers } = require('hardhat')

async function main() {
  const proxyAddress = '0x76065074344824a3201E46b84FA6611384bD7E92'
  const MadeForRats = await ethers.getContractFactory('MadeForRats')
  const contract = await MadeForRats.attach(proxyAddress)

  const crafterRole = await contract.CRAFTER_ROLE()
  await contract.grantRole(crafterRole, '0xfd0dF1cb53a9F4576D899C275928999fc73e78E1')
  console.log('Crafter role granted.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
