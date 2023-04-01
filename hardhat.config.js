require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();

if (process.env.INFURA_PROJECT_ID === undefined) {
  throw new Error("Please set your INFURA_PROJECT_ID in a .env file");
}
if (process.env.LOCALHOST_PRIVATE_KEY === undefined) {
  throw new Error("Please set your LOCALHOST_PRIVATE_KEY in a .env file");
}
if (process.env.GOERLI_PRIVATE_KEY === undefined) {
  throw new Error("Please set your GOERLI_PRIVATE_KEY in a .env file");
}
if (process.env.CELO_PRIVATE_KEY === undefined) {
  throw new Error("Please set your CELO_PRIVATE_KEY in a .env file");
}
if (process.env.AURORA_PRIVATE_KEY === undefined) {
  throw new Error("Please set your AURORA_PRIVATE_KEY in a .env file");
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
      accounts: [`${process.env.LOCALHOST_PRIVATE_KEY}`],
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`${process.env.GOERLI_PRIVATE_KEY}`],
    },
    celo: {
      url: `https://celo-mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`${process.env.CELO_PRIVATE_KEY}`],
    },
    aurora: {
      url: `https://aurora-mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`${process.env.AURORA_PRIVATE_KEY}`],
    },
  },
};
