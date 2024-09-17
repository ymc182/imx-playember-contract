import hre from "hardhat";
async function main() {
	const [deployer] = await hre.ethers.getSigners();
	const ERC20BatchTransfer = await hre.ethers.getContractFactory(
		"ERC20BatchTransfer"
	);

	const batchTransfer = await ERC20BatchTransfer.deploy();

	console.log("BatchTransfer deployed to:", await batchTransfer.getAddress());

	return {};
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
