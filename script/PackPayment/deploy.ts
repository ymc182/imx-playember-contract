import hre, { ethers } from "hardhat";
import { PackPayment } from "../../typechain-types";
async function main() {
	const [deployer] = await hre.ethers.getSigners();
	const PackPayment = await hre.ethers.getContractFactory("PackPayment");
	const packPayment = (await PackPayment.deploy(
		deployer.address
	)) as PackPayment;
	await packPayment.createPack("Gold", ethers.parseUnits("100", 18), 1000);

	console.log("PackPayment deployed to:", await packPayment.getAddress());
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
