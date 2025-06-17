const { ethers } = require('hardhat')

async function main() {
  const proxyAddress = '0x2e51a8FdC067e415CFD5d00b9add5C6Af72d676c'
  const mintQuantity = 1 // How many NFTs you want to mint
  const mintPrice = ethers.parseEther('0.01') // Match your contract price

  const CraftedCollection = await ethers.getContractFactory('CraftedCollection')
  const contract = await CraftedCollection.attach(proxyAddress)

  const totalPrice = mintPrice * BigInt(mintQuantity)
  const tx = await contract.publicMint(mintQuantity, { value: totalPrice })

  console.log('Minting transaction sent...')
  await tx.wait()

  console.log(`✅ Successfully minted ${mintQuantity} token(s)!`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
