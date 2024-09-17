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

describe("ERC20 Batch Transfer", function () {
	async function deployBoosterKeyFixture() {
		const [deployer] = await hre.ethers.getSigners();
		const Token = await hre.ethers.getContractFactory("USDC");
		const token = await Token.deploy(
			"TEST TOKEN",
			"TTT",
			"1000000000000000000000"
		);
		const BatchTransfer = await hre.ethers.getContractFactory(
			"ERC20BatchTransfer"
		);
		const batchTransfer = await BatchTransfer.deploy();
		return {
			token,
			batchTransfer,
		};
	}

	describe("Deployment", function () {
		it("Should deploy", async function () {
			const { token, batchTransfer } = await loadFixture(
				deployBoosterKeyFixture
			);
			const [deployer, user1, user2] = await hre.ethers.getSigners();

			await token.approve(
				await batchTransfer.getAddress(),
				ethers.parseUnits("150", 18)
			);

			const tx = await batchTransfer.batchTransfer(
				await token.getAddress(),
				[user1.address, user2.address],
				[ethers.parseUnits("100", 18), ethers.parseUnits("50", 18)]
			);

			const balanceUser1 = await token.balanceOf(user1.address);
			expect(balanceUser1).to.be.equal(ethers.parseUnits("100", 18));

			const balanceUser2 = await token.balanceOf(user2.address);
			expect(balanceUser2).to.be.equal(ethers.parseUnits("50", 18));

			await tx.wait();
		});
	});
});
