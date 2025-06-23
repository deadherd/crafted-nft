const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CraftedCollection", function () {
  async function deploy() {
    const Crafted = await ethers.getContractFactory("CraftedCollection");
    const [owner, user] = await ethers.getSigners();
    const proxy = await upgrades.deployProxy(Crafted, ["Crafted Collection", "CRAFT"], { initializer: "initialize" });
    await proxy.waitForDeployment();
    return { proxy, owner, user };
  }

  it("mints tokens", async function () {
    const { proxy, user } = await deploy();
    await expect(proxy.connect(user).publicMint(1, { value: ethers.parseEther("0.03") }))
      .to.emit(proxy, "Minted")
      .withArgs(user.address, 1);
    expect(await proxy.totalSupply()).to.equal(1);
  });

  it("enforces wallet limit", async function () {
    const { proxy, user } = await deploy();
    await proxy.connect(user).publicMint(3, { value: ethers.parseEther("0.09") });
    await expect(proxy.connect(user).publicMint(1, { value: ethers.parseEther("0.03") }))
      .to.be.revertedWithCustomError(proxy, "MaxWalletLimit");
  });

  it("updates price", async function () {
    const { proxy, owner, user } = await deploy();
    await proxy.connect(owner).setMintPrice(ethers.parseEther("0.05"));
    expect(await proxy.mintPrice()).to.equal(ethers.parseEther("0.05"));
    await expect(proxy.connect(user).publicMint(1, { value: ethers.parseEther("0.05") }))
      .to.emit(proxy, "Minted");
  });

  it("updates traits", async function () {
    const { proxy } = await deploy();
    await proxy.publicMint(1, { value: ethers.parseEther("0.03") });
    const traits = { code: "GEN", artVersion: "v1", metadataURI: "ipfs://" , level: 1, power: 1, rarity: 1 };
    await expect(proxy.updateTraits(0, traits)).to.emit(proxy, "TraitsUpdated");
  });
});
