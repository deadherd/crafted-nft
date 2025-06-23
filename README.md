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

## Running Tests

```shell
npx hardhat test
```

If dependencies are missing in your environment, run `npm install` first.
