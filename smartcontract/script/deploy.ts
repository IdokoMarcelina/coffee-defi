import { ethers } from "hardhat";

async function main() {
  // Deploy the contract
  const BuymeACoffee = await ethers.getContractFactory("BuymeACoffee");
  const buymeACoffee = await BuymeACoffee.deploy();

  await buymeACoffee.waitForDeployment();

  // In ethers v6, contract address is `target`
  console.log("BuymeACoffee deployed to:", buymeACoffee.target);

  // Get signers
  const [owner, tipper] = await ethers.getSigners();
  console.log("Contract owner (deployer):", owner.address);

  // Example interaction
  const name = "Alice";
  const message = "Great coffee!";
  const tipAmount = ethers.parseEther("0.01");

  // Call buyMeCoffee from tipper to owner
  const tx = await buymeACoffee
    .connect(tipper)
    .buyMeCoffee(name, message, { value: tipAmount });

  await tx.wait();

  console.log(`buyMeCoffee called by: ${tipper.address}`);
  console.log(`Sent ${ethers.formatEther(tipAmount)} ETH to ${owner.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
