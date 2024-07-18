const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TimeLock", function () {
  let TimeLock;
  let timeLock;
  let owner;
  let beneficiary;
  let otherAccount;

  beforeEach(async function () {
    [owner, beneficiary, otherAccount] = await ethers.getSigners();
    TimeLock = await ethers.getContractFactory("TimeLock");
    timeLock = await TimeLock.deploy(beneficiary.address, 3, { value: ethers.parseEther("1.0") }); // 3 months duration
    await timeLock.waitForDeployment();
  });

  it("Should set the correct initial values", async function () {
    expect(await timeLock.beneficiary()).to.equal(beneficiary.address);
    const releaseTime = await timeLock.releaseTime();
    const now = Math.floor(Date.now() / 1000);
    expect(releaseTime).to.be.closeTo(now + 90 * 24 * 60 * 60, 60); // 90 days +/- 60 seconds
  });

  it("Should not allow release before time", async function () {
    await expect(timeLock.release()).to.be.revertedWith("Current time is before release time");
  });

  it("Should allow release after time", async function () {
    await ethers.provider.send("evm_increaseTime", [91 * 24 * 60 * 60]); // 91 days
    await ethers.provider.send("evm_mine");

    const initialBalance = await ethers.provider.getBalance(beneficiary.address);
    await timeLock.release();
    const finalBalance = await ethers.provider.getBalance(beneficiary.address);

    expect(finalBalance - initialBalance).to.equal(ethers.parseEther("1.0"));
  });

  it("Should return correct balance", async function () {
    const balance = await timeLock.getBalance();
    expect(balance).to.equal(ethers.parseEther("1.0"));
  });

  it("Should return correct remaining time", async function () {
    const initialTime = await timeLock.getRemainingTime();
    expect(initialTime).to.be.closeTo(90 * 24 * 60 * 60, 60); // 90 days +/- 60 seconds

    await ethers.provider.send("evm_increaseTime", [30 * 24 * 60 * 60]); // 30 days
    await ethers.provider.send("evm_mine");

    const midTime = await timeLock.getRemainingTime();
    expect(midTime).to.be.closeTo(60 * 24 * 60 * 60, 60); // 60 days +/- 60 seconds

    await ethers.provider.send("evm_increaseTime", [61 * 24 * 60 * 60]); // Another 61 days
    await ethers.provider.send("evm_mine");

    const finalTime = await timeLock.getRemainingTime();
    expect(finalTime).to.equal(0);
  });

  it("Should not allow zero duration", async function () {
    await expect(TimeLock.deploy(beneficiary.address, 0, { value: ethers.parseEther("1.0") }))
      .to.be.revertedWith("Duration must be greater than 0");
  });

  it("Should allow anyone to call release after time", async function () {
    await ethers.provider.send("evm_increaseTime", [91 * 24 * 60 * 60]); // 91 days
    await ethers.provider.send("evm_mine");

    const initialBalance = await ethers.provider.getBalance(beneficiary.address);
    await timeLock.connect(otherAccount).release();
    const finalBalance = await ethers.provider.getBalance(beneficiary.address);

    expect(finalBalance - initialBalance).to.equal(ethers.parseEther("1.0"));
  });

  it("Should allow multiple release calls but only transfer once", async function () {
    await ethers.provider.send("evm_increaseTime", [91 * 24 * 60 * 60]); // 91 days
    await ethers.provider.send("evm_mine");

    await timeLock.release();
    const balanceAfterFirstRelease = await ethers.provider.getBalance(beneficiary.address);

    await timeLock.release(); // This should not throw an error, but also should not transfer any funds
    const balanceAfterSecondRelease = await ethers.provider.getBalance(beneficiary.address);

    expect(balanceAfterSecondRelease).to.equal(balanceAfterFirstRelease);
  });

  it("Should not allow additional deposits", async function () {
    await expect(owner.sendTransaction({
      to: await timeLock.getAddress(),
      value: ethers.parseEther("1.0")
    })).to.be.reverted;
  });
});