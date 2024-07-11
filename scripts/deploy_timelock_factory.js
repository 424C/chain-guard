const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const TimeLockFactory = await hre.ethers.getContractFactory("TimeLockFactory");
  const timeLockFactory = await TimeLockFactory.deploy();

  await timeLockFactory.waitForDeployment();

  console.log("TimeLockFactory deployed to:", await timeLockFactory.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});