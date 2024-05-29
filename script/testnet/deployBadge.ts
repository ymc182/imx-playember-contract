import hre, { ethers } from "hardhat";
import { Badges } from "../../typechain-types";
async function main() {
	const [deployer] = await hre.ethers.getSigners();
	const BadgesNFT = await hre.ethers.getContractFactory("Badges");

	const nodeUrl = "https://rpc.testnet.immutable.com/";
	const provider = new ethers.JsonRpcProvider(nodeUrl);
	const contractAddress = "0xdBE81fF535C13577cCdFc06A67A93Fd0719daFf0";
	const contract = BadgesNFT.attach(contractAddress) as Badges;

	await contract.batchMintBadges(
		[
			"0x3535d03D996ae80ecE37303881720E9987cB08e1",
			"0x0E77D5fd4311Dd894762ED7F92f699b1720BB146",
			"0xFF5e2E816517Bce0cDe4045EF88A2e216FF66c6B",
			"0xd2178Bd5C3216757680Eeb2A409E1ab63025A4c1",
			"0x3535d03D996ae80ecE37303881720E9987cB08e1",
			"0x0E77D5fd4311Dd894762ED7F92f699b1720BB146",
			"0xFF5e2E816517Bce0cDe4045EF88A2e216FF66c6B",
			"0xd2178Bd5C3216757680Eeb2A409E1ab63025A4c1",
			"0x3535d03D996ae80ecE37303881720E9987cB08e1",
			"0x0E77D5fd4311Dd894762ED7F92f699b1720BB146",
			"0x3535d03D996ae80ecE37303881720E9987cB08e1",
			"0x0E77D5fd4311Dd894762ED7F92f699b1720BB146",
			"0xFF5e2E816517Bce0cDe4045EF88A2e216FF66c6B",
			"0xd2178Bd5C3216757680Eeb2A409E1ab63025A4c1",
			"0x3535d03D996ae80ecE37303881720E9987cB08e1",
			"0x0E77D5fd4311Dd894762ED7F92f699b1720BB146",
			"0xFF5e2E816517Bce0cDe4045EF88A2e216FF66c6B",
			"0xd2178Bd5C3216757680Eeb2A409E1ab63025A4c1",
			"0x3535d03D996ae80ecE37303881720E9987cB08e1",
			"0x0E77D5fd4311Dd894762ED7F92f699b1720BB146",
			"0x3535d03D996ae80ecE37303881720E9987cB08e1",
			"0x0E77D5fd4311Dd894762ED7F92f699b1720BB146",
			"0xFF5e2E816517Bce0cDe4045EF88A2e216FF66c6B",
			"0xd2178Bd5C3216757680Eeb2A409E1ab63025A4c1",
			"0x3535d03D996ae80ecE37303881720E9987cB08e1",
			"0x0E77D5fd4311Dd894762ED7F92f699b1720BB146",
			"0xFF5e2E816517Bce0cDe4045EF88A2e216FF66c6B",
			"0xd2178Bd5C3216757680Eeb2A409E1ab63025A4c1",
			"0x3535d03D996ae80ecE37303881720E9987cB08e1",
			"0x0E77D5fd4311Dd894762ED7F92f699b1720BB146",
		],
		[
			23, 32, 1, 6, 8, 7, 9, 12, 15, 18, 20, 22, 24, 23, 33, 23, 32, 1, 6, 8, 7,
			9, 12, 15, 18, 20, 22, 24, 23, 33,
		]
	);

	console.log("Badges minted");

	// const testnetOperator = "0x6b969FD89dE634d8DE3271EbE97734FEFfcd58eE";
	// const mainnetOperator = "0x5F5EBa8133f68ea22D712b0926e2803E78D89221";

	// const testnetMintingAPI = "0x9CcFbBaF5509B1a03826447EaFf9a0d1051Ad0CF";
	// const mainnetMintingAPI = "0xbb7ee21AAaF65a1ba9B05dEe234c5603C498939E";

	// const badgeNft = await BadgesNFT.deploy(
	// 	deployer.address,
	// 	"Pixelmon Adventure Badges",
	// 	"BADGES",
	// 	"https://store.ewtd-ipfs.net/pixelmon-badges/",
	// 	"https://store.ewtd-ipfs.net/pixelmon-badges/collection.json",
	// 	testnetOperator,
	// 	"0xe163065978d9dB0CFa763cbeFcD5A9918bBbe116",
	// 	"0"
	// );
	// console.log("NFT deployed to:", await badgeNft.getAddress());
	// await badgeNft.grantMinterRole(testnetMintingAPI);
	// await badgeNft.grantMinterRole(deployer);
	// console.log("Role granted for NFT");
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
