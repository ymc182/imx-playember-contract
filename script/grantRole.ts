import hre from "hardhat";
import { Booster, BoosterKey } from "../typechain-types";
async function main() {
	const [deployer] = await hre.ethers.getSigners();
	const BoosterKey = await hre.ethers.getContractFactory("BoosterKey");

	const boosterKey = BoosterKey.attach(
		"0x7af3bd93865381ace6da2a81353b6cfe120ffd44"
	) as Booster;

	await boosterKey.grantMinterRole(deployer.address);

	await boosterKey.grantMinterRole(
		"0xC509C8C7dff810B0BbFeA77Bad60AD71fE163cdd"
	);
	console.log("Role granted");
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
