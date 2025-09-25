// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";



const BuymeACoffeeModule = buildModule("BuymeACoffeeModule", (m) => {


  const BuymeACoffee = m.contract("BuymeACoffee");

  return { BuymeACoffee };
});

export default BuymeACoffeeModule;
