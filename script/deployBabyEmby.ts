import hre from "hardhat";
async function main() {
	const [deployer] = await hre.ethers.getSigners();
	const BoosterKey = await hre.ethers.getContractFactory("BoosterKey");
	const Booster = await hre.ethers.getContractFactory("Booster");

	const testnetOperator = "0x6b969FD89dE634d8DE3271EbE97734FEFfcd58eE";
	const mainnetOperator = "0x5F5EBa8133f68ea22D712b0926e2803E78D89221";

	const testnetMintingAPI = "0x9CcFbBaF5509B1a03826447EaFf9a0d1051Ad0CF";
	const mainnetMintingAPI = "0x9CcFbBaF5509B1a03826447EaFf9a0d1051Ad0CF";

	const babyEmby = await BoosterKey.deploy(
		deployer.address,
		"Baby Emby",
		"BabyEmby",
		"https://ember-dashboard-git-dev-edgewoodtd.vercel.app/api/emberid/metadata/",
		"https://store.ewtd-ipfs.net/babyemby-collection.json",
		testnetOperator,
		"0xe163065978d9dB0CFa763cbeFcD5A9918bBbe116",
		"500"
	);

	console.log("babyEmby deployed to:", await babyEmby.getAddress());
	console.log("Granting Role to Minter API");
	await babyEmby.grantMinterRole(testnetMintingAPI);
	await babyEmby.grantMinterRole(deployer);
	console.log("Role granted");

	return {
		babyEmby,
	};
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
