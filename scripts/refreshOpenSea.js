const opensea = require('@api/opensea')

async function main() {
  const chain = 'base'
  const contractAddress = '0x76065074344824a3201E46b84FA6611384bD7E92'
  const tokenId = '0'

  opensea.server('https://api.opensea.io')

  const { data } = await opensea.refresh_nft({
    chain,
    address: contractAddress,
    identifier: tokenId,
  })

  console.log('✅ Refresh request submitted:', data)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
