const HDWalletProvider = require("@truffle/hdwallet-provider");

const mnemonic =
  "plastic picture mystery clerk motion arrest charge when betray tortoise rice wide";

module.exports = {
  networks: {
    mumbai: {
      provider: function () {
        return new HDWalletProvider(
          mnemonic,
          `https://polygon-mumbai.g.alchemy.com/v2/zakNeAd4C3mw21NxPPKBGPnO9A_eExib`
        );
      },
      network_id: "*",
      gasPrice: 0,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },

  contracts_directory: "./src/contracts/",
  contracts_build_directory: "./src/abis/",

  compilers: {
    solc: {
      version: "0.8.9",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
