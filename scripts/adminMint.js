const { ethers } = require('hardhat')

async function main() {
  const proxyAddress = '0x76065074344824a3201E46b84FA6611384bD7E92'
  const recipient = '0x7b7c54EE775CB1ad6f72bEEED82c3Bb0AF789699'
  //const recipient = '0xfd0dF1cb53a9F4576D899C275928999fc73e78E1'
  const quantity = 1

  const MadeForRats = await ethers.getContractFactory('MadeForRats')
  const contract = await MadeForRats.attach(proxyAddress)

  await contract.adminMint(recipient, quantity)
  console.log(`✅ Admin minted ${quantity} token(s) to ${recipient}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
