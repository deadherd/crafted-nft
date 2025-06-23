const { ethers } = require('hardhat')

async function main() {
  const proxyAddress = '0x76065074344824a3201E46b84FA6611384bD7E92'
  const mintQuantity = 1 // How many NFTs you want to mint
  const mintPrice = ethers.parseEther('0.01') // Match your contract price

  const MadeForRats = await ethers.getContractFactory('MadeForRats')
  const contract = await MadeForRats.attach(proxyAddress)

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
