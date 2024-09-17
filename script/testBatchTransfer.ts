import hre, { ethers } from "hardhat";
import { ERC20BatchTransfer, USDC } from "../typechain-types";
async function main() {
	const [deployer] = await hre.ethers.getSigners();
	const ERC20BatchTransfer_CONTRACT = await hre.ethers.getContractFactory(
		"ERC20BatchTransfer"
	);

	const TOKEN_CONTRACT = await hre.ethers.getContractFactory("USDC");
	const tokenAddress = "0xc555D625828c4527d477e595fF1Dd5801B4a600e";

	const token = TOKEN_CONTRACT.attach(
		"0xc555D625828c4527d477e595fF1Dd5801B4a600e"
	) as USDC;

	const contractAddress = "0x75Aea067d3bE64e9055f8b97836a7Ce4f7e2B5fC";
	const batchTransfer = ERC20BatchTransfer_CONTRACT.attach(
		contractAddress
	) as ERC20BatchTransfer;

	await token.approve(contractAddress, ethers.parseEther("0.2"));

	console.log("BatchTransfer deployed to:", await batchTransfer.getAddress());

	const tx = await batchTransfer.batchTransfer(
		"0xc555D625828c4527d477e595fF1Dd5801B4a600e",
		[
			"0x15fbA23d539D2F95167aA510de31fbeA4af302f7",
			"0x15fbA23d539D2F95167aA510de31fbeA4af302f7",
		],
		[ethers.parseEther("0.1"), ethers.parseEther("0.1")]
	);

	const res = await tx.wait();

	console.log(res);

	return {};
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
