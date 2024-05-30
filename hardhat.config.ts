import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@xyrusworx/hardhat-solidity-json";
const config: HardhatUserConfig = {
	solidity: {
		version: "0.8.19",
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	networks: {
		mainnet: {
			url: "https://rpc.immutable.com/",
			accounts: [process.env.PRIVATE_KEY!],
		},
		testnet: {
			url: "https://rpc.testnet.immutable.com/",
			accounts: [process.env.PRIVATE_KEY!],
		},
	},
};

export default config;
