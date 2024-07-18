const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ChainGuardEscrow", function () {
  let ChainGuardEscrow;
  let escrow;
  let owner;
  let arbiter;
  let depositor;
  let beneficiary;

  beforeEach(async function () {
    [owner, arbiter, depositor, beneficiary] = await ethers.getSigners();
    ChainGuardEscrow = await ethers.getContractFactory("ChainGuardEscrow");
    escrow = await ChainGuardEscrow.deploy(
      arbiter.address,
      depositor.address,
      beneficiary.address,
      30, // 30 days duration
      { value: ethers.parseEther("1.0") }
    );
    await escrow.waitForDeployment();
  });

  it("Should set the correct initial values", async function () {
    expect(await escrow.arbiter()).to.equal(arbiter.address);
    expect(await escrow.depositor()).to.equal(depositor.address);
    expect(await escrow.beneficiary()).to.equal(beneficiary.address);
    expect(await escrow.getState()).to.equal(0); // Pending state
    expect(await escrow.duration()).to.equal(30 * 24 * 60 * 60); // 30 days in seconds
  });

  it("Should allow arbiter to approve and release funds", async function () {
    const initialBalance = await ethers.provider.getBalance(beneficiary.address);
    await escrow.connect(arbiter).approve();
    const finalBalance = await ethers.provider.getBalance(beneficiary.address);

    expect(await escrow.getState()).to.equal(1); // Approved state
    expect(finalBalance - initialBalance).to.equal(ethers.parseEther("1.0"));
  });

  it("Should not allow non-arbiter to approve", async function () {
    await expect(escrow.connect(depositor).approve()).to.be.revertedWith("Only arbiter can approve");
  });

  it("Should allow depositor to refund after duration", async function () {
    await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]); // 31 days
    await ethers.provider.send("evm_mine");

    const initialBalance = await ethers.provider.getBalance(depositor.address);
    const tx = await escrow.connect(depositor).refund();
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed * receipt.gasPrice;

    const finalBalance = await ethers.provider.getBalance(depositor.address);

    expect(await escrow.getState()).to.equal(2); // Refunded state
    expect(finalBalance - initialBalance + gasUsed).to.be.closeTo(ethers.parseEther("1.0"), ethers.parseEther("0.01"));
  });

  it("Should not allow refund before duration", async function () {
    await expect(escrow.connect(depositor).refund()).to.be.revertedWith("Not authorized to refund");
  });

  it("Should allow arbiter to refund at any time", async function () {
    const initialBalance = await ethers.provider.getBalance(depositor.address);
    await escrow.connect(arbiter).refund();
    const finalBalance = await ethers.provider.getBalance(depositor.address);

    expect(await escrow.getState()).to.equal(2); // Refunded state
    expect(finalBalance - initialBalance).to.equal(ethers.parseEther("1.0"));
  });

  it("Should return correct remaining time", async function () {
    const initialTime = await escrow.getRemainingTime();
    expect(initialTime).to.be.closeTo(30 * 24 * 60 * 60, 5); // 30 days in seconds, with 5 seconds tolerance

    await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]); // 15 days
    await ethers.provider.send("evm_mine");

    const midTime = await escrow.getRemainingTime();
    expect(midTime).to.be.closeTo(15 * 24 * 60 * 60, 5); // 15 days in seconds, with 5 seconds tolerance

    await ethers.provider.send("evm_increaseTime", [16 * 24 * 60 * 60]); // Another 16 days
    await ethers.provider.send("evm_mine");

    const finalTime = await escrow.getRemainingTime();
    expect(finalTime).to.equal(0);
  });

  it("Should not allow creation with zero duration", async function () {
    await expect(ChainGuardEscrow.deploy(
      arbiter.address,
      depositor.address,
      beneficiary.address,
      0,
      { value: ethers.parseEther("1.0") }
    )).to.be.revertedWith("Duration must be greater than 0");
  });

  it("Should not allow creation with zero addresses", async function () {
    await expect(ChainGuardEscrow.deploy(
      ethers.ZeroAddress,
      depositor.address,
      beneficiary.address,
      30,
      { value: ethers.parseEther("1.0") }
    )).to.be.revertedWith("Invalid addresses");
  });
});