# Crafted Collection

This repository contains an upgradeable ERC‑721A contract used to manage the **Crafted Collection** NFT series. The collection is limited to `888` special edition tokens. Each token stores on‑chain traits that can be updated by an authorised crafter account. The contract includes:

* Access control using `ADMIN_ROLE` and `CRAFTER_ROLE`.
* Upgradeability via UUPS pattern.
* Pausable and re‑entrancy safe minting and withdrawals.
* ERC‑2981 royalty support and queryable token enumeration.
* Events for minting, trait updates, metadata updates and withdrawals.

### Useful commands

```shell
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.js --network <network>
```
