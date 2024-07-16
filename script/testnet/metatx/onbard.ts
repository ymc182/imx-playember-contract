import {
	time,
	loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import {
	AnalyticsBase,
	AnalyticsContext,
	AnalyticsForwarder,
	Onboard,
} from "../../../typechain-types";

async function main() {
	const Onboard = await hre.ethers.getContractFactory("Onboard");
	const AnalyticsBase = await hre.ethers.getContractFactory("AnalyticsBase");
	const [deployer] = await hre.ethers.getSigners();

	/* 	const onboard = (await Onboard.deploy()) as Onboard;
	const analyticsBase = (await AnalyticsBase.deploy()) as AnalyticsBase;

	const onboardAddress = await onboard.getAddress();
	const analyticsBaseAddress = await analyticsBase.getAddress();

	console.log("Onboard deployed to:", onboardAddress);
	console.log("AnalyticsBase deployed to:", analyticsBaseAddress); */

	const onboard = Onboard.attach(
		"0xD7C460f4556b197358b3eC22b99E8fA086BaE49a"
	) as Onboard;
	const analyticsBase = AnalyticsBase.attach(
		"0x5946B53F489A3c376Ce4A1673cee4D8f72B56a8e"
	) as AnalyticsBase;

	const walletsCount = 10;
	const fundPerWallet = 0.000265;
	const total = fundPerWallet * walletsCount;

	//create 100 random wallets
	const wallets = Array.from({ length: walletsCount }, () =>
		ethers.Wallet.createRandom().connect(hre.ethers.provider)
	);

	//send 0.0005 eth to each wallet

	const tx = await onboard.connect(deployer).onBoard(
		wallets.map((wallet) => wallet.address),
		Array.from({ length: walletsCount }, () =>
			ethers.parseEther(fundPerWallet.toString())
		),
		{
			value: ethers.parseEther(total.toString()),
		}
	);

	await tx.wait();

	const promises = wallets.map((wallet) =>
		analyticsBase
			.connect(wallet)
			.gameEventExecute("1669423_______earnedBadge___13314___Stage_5", {
				maxPriorityFeePerGas: ethers.parseUnits("10", "gwei"), // Adjusted tip
				maxFeePerGas: ethers.parseUnits("10.000000049", "gwei"),
				gasLimit: 26000,
			})
	);

	await Promise.all(promises);

	console.log("Badges earned for all wallets");
}
//0.002400000000000000
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
