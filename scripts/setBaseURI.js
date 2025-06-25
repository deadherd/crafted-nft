async function main() {
  const proxyAddress = '0x76065074344824a3201E46b84FA6611384bD7E92'
  const baseURI = 'ipfs://QmWrjnVNskpNFG5jsN17xfbFo8UWAQtkLuEeNmUQoxc9zL/'

  const MadeForRats = await ethers.getContractFactory('MadeForRats')
  const contract = await MadeForRats.attach(proxyAddress)

  await contract.setBaseURI(baseURI)
  console.log('✅ Base URI updated:', baseURI)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
