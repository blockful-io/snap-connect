import { ethers } from "ethers";
import SnapConnectNFT from "../contracts/SnapConnectNFT.sol";

const provider = new ethers.JsonRpcProvider(process.env.ETH_PROVIDER_URL);
const contractAddress = process.env.SNAP_CONNECT_NFT_CONTRACT_ADDRESS || "";
if (!contractAddress) {
  throw new Error("SNAP_CONNECT_NFT_CONTRACT_ADDRESS is not defined");
}
const abi = SnapConnectNFT.abi;

const contract = new ethers.Contract(contractAddress, abi, provider);

export async function checkNFTBalance(
  signedMessageHash: string
): Promise<string | null> {
  // TODO: Recover user's address from signed message hash and check the balance
  // If the user has the NFT, return the user's address, otherwise return null

  return null;
}
