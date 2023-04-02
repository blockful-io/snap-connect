require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();

if (process.env.INFURA_PROJECT_ID === undefined) {
  throw new Error("Please set your INFURA_PROJECT_ID in a .env file");
}
if (process.env.PRIVATE_KEY === undefined) {
  throw new Error("Please set your PRIVATE_KEY in a .env file");
}

module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    localhost: {
      url: "http://localhost:7545",
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    celo: {
      url: `https://celo-mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    aurora: {
      url: `https://aurora-mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
  },
};
