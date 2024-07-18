import hre, { ethers } from "hardhat";
import { PackPayment } from "../../typechain-types";
import { PACK_PAYMENT_TESTNET_CONTRACT } from "./constant";
async function main() {
	const [deployer] = await hre.ethers.getSigners();
	const PackPayment = await hre.ethers.getContractFactory("PackPayment");
	const packPayment = PackPayment.attach(
		PACK_PAYMENT_TESTNET_CONTRACT
	) as PackPayment;
	await packPayment.setNativePrice(1, ethers.parseUnits("0.001", 18));

	const packs = await packPayment.getAllPacks();
	console.log(packs);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
