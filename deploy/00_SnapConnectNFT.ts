import { ethers } from "hardhat";
import dotenv from "dotenv";
dotenv.config();

module.exports = async ({ deployments }) => {
  const { deploy } = deployments;
  const signers = await ethers.getSigners();
  const owner = signers[0].address;
  await deploy("SnapConnectNFT", {
    from: owner,
    args: [],
    log: true,
  });
  // print in red
  console.log(
    "\x1b[31m%s\x1b[0m",
    "SnapConnectNFT deployed with address:",
    owner
  );
};
module.exports.tags = ["SnapConnectNFT"];
