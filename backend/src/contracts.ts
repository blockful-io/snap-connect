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

const possibleNetworks = ["mumbai", "celo", "aurora"] as const;

const contractAbi = [
  "function mint(address to, uint256 tokenId) public returns (uint256)",
];
const providerUrls = {
  mumbai: `https://polygon-mumbai.infura.io/v3/${INFURA_PROJECT_ID}`,
  celo: `https://celo-alfajores.infura.io/v3/${INFURA_PROJECT_ID}`,
  aurora: `https://aurora-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
};

const contracts = {
  mumbai: new ethers.Contract(
    "0x82ed5CC133b6301f67Dfbc946e1c56F202B1f7A2",
    contractAbi,
    new ethers.providers.JsonRpcProvider(providerUrls.mumbai)
  ),
  celo: new ethers.Contract(
    "0x32F506c37Bd1CbD08bc88675f62502bF3E40b234",
    contractAbi,
    new ethers.providers.JsonRpcProvider(providerUrls.celo)
  ),
  aurora: new ethers.Contract(
    "0x81AaDde5592ee4eE79473dF2AB2eb085E9636A1c",
    contractAbi,
    new ethers.providers.JsonRpcProvider(providerUrls.aurora)
  ),
};
const providers = {
  mumbai: new ethers.providers.JsonRpcProvider(providerUrls.mumbai),
  celo: new ethers.providers.JsonRpcProvider(providerUrls.celo),
  aurora: new ethers.providers.JsonRpcProvider(providerUrls.aurora),
};

export async function mintNft(req: express.Request, res: express.Response) {
  const { userId, network, address } = req.body;
  if (!userId) {
    return res.status(400).send({ error: "userId is required" });
  }
  if (network && !possibleNetworks.includes(network)) {
    return res
      .status(400)
      .send({ error: `network must be one of ${possibleNetworks.join(", ")}` });
  }
  if (!address || !ethers.utils.isAddress(address)) {
    return res
      .status(400)
      .send({ error: "address is required and must be valid" });
  }

  // @ts-ignore
  const wallet = new ethers.Wallet(PRIVATE_KEY, providers[network]);
  console.log("wallet address", wallet.address);

  try {
    // @ts-ignore
    const contract = contracts[network];
    console.log("contract address", contract.address);
    const tx = await contract
      .connect(wallet)
      .mint(address, Number(Math.floor(Math.random() * 100000000)));
    const receipt = await tx.wait();
    console.log(receipt);
    await sendFinalMessage(userId, receipt.transactionHash, network);
    res.send({ success: true, receipt });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
}
