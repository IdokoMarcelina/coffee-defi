import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("BuymeACoffee", function () {

  async function deployBuymeACoffeeFixture() {
    

    const [owner, otherAccount] = await hre.ethers.getSigners();

    const BuymeACoffee = await hre.ethers.getContractFactory("BuymeACoffee");
    const buymeACoffee = await BuymeACoffee.deploy();

    return { buymeACoffee, owner, otherAccount };
  }

  describe("Deployment", function () {
   it("Should buy coffee for the owner", async function () {
  const { buymeACoffee, owner, otherAccount } = await loadFixture(deployBuymeACoffeeFixture);

    const coffeeTx = await buymeACoffee.connect(otherAccount).buyMeCoffee(
  "mimi",                        // name
  "this is a gift",              // message
  { value: hre.ethers.parseEther("1") }
);

await expect(coffeeTx)
  .to.emit(buymeACoffee, "NewMemo")
  .withArgs(
    otherAccount.address,   // from
    owner.address,          // to (owner set in constructor)
    anyValue,               // timestamp
    "mimi",                 // name
    "this is a gift"        // message
  );

});
;




  });
});
