# Crafted Collection

This repository contains an upgradeable ERC‑721A contract used to manage the **Crafted Collection** NFT series. The collection is limited to `888` special edition tokens. Each token stores on‑chain traits that can be updated by an authorised crafter account. The contract includes:

- Access control using `ADMIN_ROLE` and `CRAFTER_ROLE`.
- Upgradeability via UUPS pattern.
- Pausable and re‑entrancy safe minting and withdrawals.
- ERC‑2981 royalty support and queryable token enumeration.
- Events for minting, trait updates, metadata updates and withdrawals.

### Useful commands

```shell
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.js --network <network>
```

### CLI scripts

- `adminMint.js` – mint tokens as an admin without payment
- `freezeMetadata.js` – permanently lock metadata for a token
- `getTraits.js` – view the on-chain traits for a token
- `grantRole.js` – grant roles such as `CRAFTER_ROLE`
- `mint.js` – mint tokens from the CLI
- `pause.js`/`unpause.js` – pause or resume minting
- `setBaseURI.js` – set the base metadata URI
- `setCollectionDetails.js` – rename the collection
- `setMaxWalletHoldings.js` – update the wallet holding limit
- `setMintPrice.js` – change the mint price
- `setRoyaltyInfo.js` – configure royalties
- `updateMetadata.js` – update a token metadata URI
- `updateTraits.js` – modify token traits
- `upgrade.js` – upgrade the implementation
- `withdraw.js` – withdraw contract balance
- `refreshOpenSea.js` – request a metadata refresh on OpenSea

The Hardhat config enables the Solidity optimizer with 100 runs to keep the
contract bytecode small enough for mainnet deployment. No additional steps are
required when compiling.

## Deploying to Base Mainnet

1. Copy `.env.example` to `.env` and set `PRIVATE_KEY` with your deployer wallet and `BASE_MAINNET_RPC` with the RPC URL for Base mainnet. Optional: `BASE_SEPOLIA_RPC` for testing.
2. Deploy the proxy contract:

```shell
npx hardhat run scripts/deploy.js --network base
```

3. After deployment, note the proxy address and update your scripts as needed.

## Preparing for Mint

1. **Set Placeholder URI** – before reveal, set the base URI to your placeholder folder:

```shell
npx hardhat run scripts/setBaseURI.js --network base
```

2. **Update Mint Price or Wallet Limit** – if needed:

```shell
npx hardhat run --network base --script "(await ethers.getContractFactory('MadeForRats')).attach('<proxy>').setMintPrice(ethers.parseEther('0.05'))"
```

or update the wallet cap similarly using `setMaxWalletHoldings`.

3. **Rename Collection** – change the name or ticker after deployment:

```shell
npx hardhat run --network base --script "(await ethers.getContractFactory('MadeForRats')).attach('<proxy>').setCollectionDetails('New Name','NEW')"
```

4. **Reveal Metadata** – once artwork is ready, run `setBaseURI` again with the final metadata location.
5. **Withdraw Funds** – the `withdraw` script sends contract balance to the recipient wallet set in the script. Update `scripts/withdraw.js` with your treasury address.
6. **Refresh Metadata on OpenSea** – after changing a token URI, run `node scripts/refreshOpenSea.js` to clear the cache.

## Running Tests

```shell
npx hardhat test
```

If dependencies are missing in your environment, run `npm install` first.
