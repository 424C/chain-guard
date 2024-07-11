const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ChainGuardEscrow", function () {
  let ChainGuardEscrow;
  let escrow;
  let owner;
  let arbiter;
  let beneficiary;
  let otherAccount;

  beforeEach(async function () {
    [owner, arbiter, beneficiary, otherAccount] = await ethers.getSigners();
    ChainGuardEscrow = await ethers.getContractFactory("ChainGuardEscrow");
    escrow = await ChainGuardEscrow.deploy(arbiter.address, owner.address, beneficiary.address, 30);
    await escrow.waitForDeployment();
  });

  it("Should set the correct arbiter, depositor, and beneficiary", async function () {
    expect(await escrow.arbiter()).to.equal(arbiter.address);
    expect(await escrow.depositor()).to.equal(owner.address);
    expect(await escrow.beneficiary()).to.equal(beneficiary.address);
  });

  it("Should not allow non-arbiter to approve", async function () {
    await expect(escrow.connect(otherAccount).approve()).to.be.revertedWith("Only arbiter can approve");
  });

  it("Should allow arbiter to approve", async function () {
    await escrow.connect(arbiter).approve();
    expect(await escrow.isApproved()).to.be.true;
  });

  it("Should not allow refund before duration is over", async function () {
    await expect(escrow.connect(owner).refund()).to.be.revertedWith("Not authorized to refund");
  });

  it("Should allow refund after duration is over", async function () {
    await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]); // Increase time by 31 days
    await ethers.provider.send("evm_mine"); // Mine a new block
    await escrow.connect(owner).refund();
  });
});

describe("EscrowFactory", function () {
  let EscrowFactory;
  let factory;
  let owner;
  let arbiter;
  let beneficiary;

  beforeEach(async function () {
    [owner, arbiter, beneficiary] = await ethers.getSigners();
    EscrowFactory = await ethers.getContractFactory("EscrowFactory");
    factory = await EscrowFactory.deploy();
    await factory.waitForDeployment();
  });

  it("Should create a new escrow", async function () {
    const tx = await factory.createEscrow(arbiter.address, beneficiary.address, 30, { value: ethers.parseEther("1.0") });
    const receipt = await tx.wait();
    const event = receipt.logs.find(log => log.fragment.name === 'EscrowCreated');
    expect(event).to.not.be.undefined;
    const escrowAddress = event.args.escrowAddress;
    expect(escrowAddress).to.not.be.null;
  });

  it("Should retrieve all created escrows", async function () {
    await factory.createEscrow(arbiter.address, beneficiary.address, 30, { value: ethers.parseEther("1.0") });
    await factory.createEscrow(arbiter.address, beneficiary.address, 60, { value: ethers.parseEther("2.0") });
    const escrows = await factory.getEscrows();
    expect(escrows.length).to.equal(2);
  });
});