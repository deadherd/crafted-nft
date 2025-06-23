const { ethers, upgrades } = require('hardhat')

async function main() {
  const MadeForRats = await ethers.getContractFactory('MadeForRats')
  const proxy = await upgrades.deployProxy(MadeForRats, ['Made for Rats™', 'MFR'], {
    initializer: 'initialize',
  })

  await proxy.waitForDeployment()
  console.log('Deployed to:', await proxy.getAddress())
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
