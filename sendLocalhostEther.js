const ethers = require("ethers");
require("dotenv").config();

const FROM_PRIVATE_KEY =
  "0xa6fcb74e91392c28404072d7dcde8215d8f632ebe613a9648d982c5f7c24e8f2";
const to_private_key = process.env.LOCALHOST_PRIVATE_KEY;

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://localhost:7545"
  );
  const wallet = new ethers.Wallet(FROM_PRIVATE_KEY, provider);
  const toWallet = new ethers.Wallet(to_private_key, provider);
  const tx = await wallet.sendTransaction({
    to: toWallet.address,
    value: ethers.utils.parseEther("1.0"),
  });
  console.log("tx: ", tx);
  const receipt = await tx.wait();
  console.log("receipt: ", receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
