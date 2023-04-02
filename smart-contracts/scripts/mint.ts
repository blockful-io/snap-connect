import * as hardhat from "hardhat";

async function main() {
  const signer = hardhat.ethers.provider.getSigner();

  const SnapConnectCommunity = await hardhat.ethers.getContractFactory(
    "SnapConnectCommunity",
    signer
  );
  const snapConnectCommunity = SnapConnectCommunity.attach(
    "0x81AaDde5592ee4eE79473dF2AB2eb085E9636A1c"
  );

  await snapConnectCommunity.safeMint(
    "0x98CB304bd6Eb1640F48108Cb42344904F73f0FeE"
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
