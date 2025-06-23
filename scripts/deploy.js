const { ethers, upgrades } = require('hardhat')

async function main() {
  const CraftedCollection = await ethers.getContractFactory('CraftedCollection')
  const proxy = await upgrades.deployProxy(CraftedCollection, ['Made for Rats', 'CRAFT'], {
    initializer: 'initialize',
  })

  await proxy.waitForDeployment()
  console.log('Deployed to:', await proxy.getAddress())
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
