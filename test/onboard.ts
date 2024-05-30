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
} from "../typechain-types";

describe("Onboard", function () {
	async function deployBoosterKeyFixture() {
		const [deployer] = await hre.ethers.getSigners();
		const Onboard = await hre.ethers.getContractFactory("Onboard");
		const AnalyticsBase = await hre.ethers.getContractFactory("AnalyticsBase");
		const onboard = (await Onboard.deploy()) as Onboard;
		const analyticsBase = (await AnalyticsBase.deploy()) as AnalyticsBase;

		return {
			onboard,
			analyticsBase,
		};
	}

	describe("Deployment", function () {
		it("Should deploy", async function () {
			const { onboard, analyticsBase } = await loadFixture(
				deployBoosterKeyFixture
			);
			const [deployer] = await hre.ethers.getSigners();

			const walletsCount = 100;
			const fundPerWallet = 0.00101;
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
				analyticsBase.connect(wallet).earnBadges()
			);

			await Promise.all(promises);

			console.log("Badges earned for all wallets");
		});
	});
});
