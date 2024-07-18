import hre, { ethers } from "hardhat";
import { PackPayment } from "../../typechain-types";
async function main() {
	const [deployer] = await hre.ethers.getSigners();
	const PackPayment = await hre.ethers.getContractFactory("PackPayment");
	const contractAddress = "0xDd66e40689eAbcA00C70EC25f1857516cf312a03";
	const packPayment = PackPayment.attach(contractAddress) as PackPayment;
	await packPayment.removePack(1);
	await packPayment.removePack(2);

	const packs = await packPayment.getAllPacks();
	console.log(packs);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
