const { ethers } = require('hardhat')

async function main() {
  const proxyAddress = '0x76065074344824a3201E46b84FA6611384bD7E92'
  const recipient = '0xfd0dF1cb53a9F4576D899C275928999fc73e78E1'

  const MadeForRats = await ethers.getContractFactory('MadeForRats')
  const contract = await MadeForRats.attach(proxyAddress)

  await contract.withdraw(recipient)
  console.log('✅ Withdraw complete.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
