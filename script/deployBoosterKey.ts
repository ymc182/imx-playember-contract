import hre from "hardhat";
async function main() {
	const [deployer] = await hre.ethers.getSigners();
	const BoosterKey = await hre.ethers.getContractFactory("BoosterKey");

	const testnetOperator = "0x6b969FD89dE634d8DE3271EbE97734FEFfcd58eE";
	const mainnetOperator = "0x5F5EBa8133f68ea22D712b0926e2803E78D89221";

	const testnetMintingAPI = "0x9CcFbBaF5509B1a03826447EaFf9a0d1051Ad0CF";
	const mainnetMintingAPI = "0xbb7ee21AAaF65a1ba9B05dEe234c5603C498939E";

	const boosterKey = await BoosterKey.deploy(
		deployer.address,
		"PlayEmber Booster Key",
		"PE-KEY",
		"https://store.ewtd-ipfs.net/key/",
		"https://store.ewtd-ipfs.net/key-collection.json",
		mainnetOperator,
		"0xe163065978d9dB0CFa763cbeFcD5A9918bBbe116",
		"0"
	);
	console.log("BoosterKey deployed to:", await boosterKey.getAddress());
	await boosterKey.grantMinterRole(mainnetMintingAPI);
	await boosterKey.grantMinterRole(deployer);
	console.log("Role granted for BoosterKey");
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
