async function main() {
  const proxyAddress = '0x2e51a8FdC067e415CFD5d00b9add5C6Af72d676c'
  const baseURI = 'ipfs://QmWUAmvYFbdHGZhqvasxaCURBw4PRUUewJDmgnhPQf1Kg7/'

  const CraftedCollection = await ethers.getContractFactory('CraftedCollection')
  const contract = await CraftedCollection.attach(proxyAddress)

  await contract.setBaseURI(baseURI)
  console.log('✅ Base URI updated:', baseURI)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
