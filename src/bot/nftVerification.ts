import { Context } from "telegraf";
import { checkNFTBalance } from "../utils/web3";

export async function nftVerification(ctx: Context) {
  const signedMessageHash = ctx.message;

  console.log(signedMessageHash);
  throw new Error("Not implemented");

  // Verify NFT ownership and get the user's address
  const userAddress = await checkNFTBalance(signedMessageHash);

  if (userAddress) {
    // TODO: Generate single-use invite link and send it to the user
    ctx.reply(
      "You have the NFT! Here's your invite link: [Generated Invite Link]"
    );
  } else {
    ctx.reply(
      "You don't have the required NFT. Please try again with a valid signature."
    );
  }
}
