const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const ChainGuardEscrow = await hre.ethers.getContractFactory("ChainGuardEscrow");
  const chainGuardEscrow = await ChainGuardEscrow.deploy(deployer.address, deployer.address, { value: hre.ethers.parseEther("0.001") });

  await chainGuardEscrow.waitForDeployment();

  console.log("ChainGuardEscrow deployed to:", await chainGuardEscrow.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});