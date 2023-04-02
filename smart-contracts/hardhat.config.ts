import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    celo: {
      accounts: [process.env.DEPLOYER_PRIVATE_KEY!],
      url: "https://celo-mainnet.infura.io/v3/b833361d21c441529337457d3c434884",
      chainId: 42220,
    },
    celoAlfajores: {
      accounts: [process.env.DEPLOYER_PRIVATE_KEY!],
      url: "https://celo-alfajores.infura.io/v3/b833361d21c441529337457d3c434884",
      chainId: 44787,
    },
    aurora: {
      accounts: [process.env.DEPLOYER_PRIVATE_KEY!],
      url: "https://aurora-mainnet.infura.io/v3/b833361d21c441529337457d3c434884",
      chainId: 1313161554,
    },
    auroraTestnet: {
      accounts: [process.env.DEPLOYER_PRIVATE_KEY!],
      url: "https://aurora-testnet.infura.io/v3/b833361d21c441529337457d3c434884",
      chainId: 1313161555,
    },
  },
  etherscan: {
    apiKey: {
      celo: "4Y22CESXCCPAW1QSKU8E5AD2DDJJUM3IWK",
      celoAlfajores: "4Y22CESXCCPAW1QSKU8E5AD2DDJJUM3IWK",
      aurora: "YOUR_ARBISCAN_API_KEY",
      auroraTestnet: "YOUR_ARBISCAN_API_KEY",
    },
    customChains: [
      {
        network: "celo",
        chainId: 42220,
        urls: {
          apiURL: "https://api.celoscan.io/api",
          browserURL: "https://celoscan.io/",
        },
      },
      {
        network: "celoAlfajores",
        chainId: 44787,
        urls: {
          apiURL: "https://api-alfajores.celoscan.io/api",
          browserURL: "https://alfajores.celoscan.io/",
        },
      },
      {
        network: "celoAlfajores",
        chainId: 44787,
        urls: {
          apiURL: "https://api-alfajores.celoscan.io/api",
          browserURL: "https://alfajores.celoscan.io/",
        },
      },
      {
        network: "celoAlfajores",
        chainId: 44787,
        urls: {
          apiURL: "https://api-alfajores.celoscan.io/api",
          browserURL: "https://alfajores.celoscan.io/",
        },
      },
    ],
  },
};

export default config;
