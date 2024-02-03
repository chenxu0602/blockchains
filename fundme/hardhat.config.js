require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("solidity-coverage")
require("@nomicfoundation/hardhat-verify")
require("hardhat-gas-reporter")
require("hardhat-deploy")
require("@nomiclabs/hardhat-ethers")

const SEPOLIA_RPC_URL =
    process.env.SEPOLIA_PRC_URL ||
    "https://eth-sepolia.g.alchemy.com/v2/1aFij6Ke0KYr01sGbL8Xug_qqSOyEE7G"
const PRIVATE_KEY =
    process.env.PRIVATE_KEY ||
    "1120b26e353dbb22e567bf42a9d11376491a23398beb4799ec133f5e0bf1ed8f"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        compilers: [{ version: "0.6.0" }, { version: "0.8.19" }],
    },
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
        },
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmations: 6,
        },
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 31337,
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: COINMARKETCAP_API_KEY,
        token: "MATIC",
    },
    namedAccounts: {
        deployer: {
            default: 0,
            31337: 1,
            1115511: 2,
        },
    },
}
