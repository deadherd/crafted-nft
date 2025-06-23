const { ethers, upgrades } = require('hardhat')

async function main() {
  const proxyAddress = '0x76065074344824a3201E46b84FA6611384bD7E92'
  const MadeForRats = await ethers.getContractFactory('MadeForRats')
  const upgraded = await upgrades.upgradeProxy(proxyAddress, MadeForRats)
  console.log('✅ Upgrade complete')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
