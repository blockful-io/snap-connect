import dotenv from "dotenv";
import { cleanEnv, num, str } from "envalid";
import { ethers } from "ethers";
import express from "express";
import { sendFinalMessage } from "./bot";

dotenv.config();

const env = cleanEnv(process.env, {
  INFURA_PROJECT_ID: str(),
  PRIVATE_KEY: str(),
});
const INFURA_PROJECT_ID = env.INFURA_PROJECT_ID;
const PRIVATE_KEY = env.PRIVATE_KEY;

const provider = new ethers.providers.JsonRpcProvider(
  `https://polygon-mumbai.infura.io/v3/${INFURA_PROJECT_ID}`
);

const contract = new ethers.Contract(
  "0x931332ca07C59CEA8eE4540a0fBD3d7676a57D0d",
  [
    "function tokenURI(uint256) public pure returns (string memory)",
    "function safeMint(address to) public",
    "function totalSupply() public view returns (uint256)",
  ],
  provider
);
const deployerWallet = new ethers.Wallet(PRIVATE_KEY, provider);

export async function mintNft(req: express.Request, res: express.Response) {
  const { userId, address } = req.body;
  if (!userId) {
    return res.status(400).send({ error: "userId is required" });
  }
  if (!address || !ethers.utils.isAddress(address)) {
    return res
      .status(400)
      .send({ error: "address is required and must be valid" });
  }

  try {
    console.log("contract address", contract.address);
    const tx = await contract.connect(deployerWallet).safeMint(address);
    const receipt = await tx.wait();
    console.log("transactionHash", receipt.transactionHash);
    await sendFinalMessage(userId, receipt.transactionHash);
    console.log("sent final message");
    res.send({ success: true, receipt });
  } catch (error: any) {
    console.log("error", error);
    res.status(500).send({ error: error.message });
  }
}
