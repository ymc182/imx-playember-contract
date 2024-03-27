import hre from "hardhat";
async function main() {
	const [deployer] = await hre.ethers.getSigners();
	const testUsdc = await hre.ethers.getContractFactory("USDC");

	const testUSDC = await testUsdc.deploy(
		"PE USDC",
		"PEUSDC",
		hre.ethers.parseEther("1000000000")
	);

	/* console.log("BoosterKey deployed to:", await boosterKey.getAddress()); */
	console.log("Booster deployed to:", await testUSDC.getAddress());
	return {
		/* boosterKey, */
		testUSDC,
	};
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
