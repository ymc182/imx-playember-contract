import {
	time,
	loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { PackPayment, USDC } from "../typechain-types";
describe("PackPayment", function () {
	async function deployBoosterKeyFixture() {
		const [deployer, receiver] = await hre.ethers.getSigners();
		const PackPayment = await hre.ethers.getContractFactory("PackPayment");
		const DummyToken = await hre.ethers.getContractFactory("USDC");
		const packPayment = (await PackPayment.deploy(
			receiver.address
		)) as PackPayment;
		const dummyToken = (await DummyToken.deploy(
			"TEST TOKEN",
			"TTT",
			"1000000000000000000000"
		)) as USDC;

		//track events
		const typedContractEvent = packPayment.filters.PaymentReceived;
		packPayment.on(
			typedContractEvent,
			(from, tokenAddress, amount, packName, emberId, hash) => {
				console.log("PaymentReceived", {
					from,
					tokenAddress,
					amount,
					packName,
					emberId,
					hash,
				});
			}
		);
		return {
			packPayment,
			dummyToken,
		};
	}

	it("Should deploy", async function () {
		const { packPayment, dummyToken } = await loadFixture(
			deployBoosterKeyFixture
		);

		const [deployer, receiver] = await hre.ethers.getSigners();

		//add ERC20 token to payment
		await packPayment.createPack("Gold", ethers.parseUnits("100", 18), 3);
		await packPayment.createPack("Bronze", ethers.parseUnits("50", 18), 5);

		//add erc20 token to payment
		await packPayment.addERC20Payment(
			1,
			await dummyToken.getAddress(),
			ethers.parseUnits("100", 18)
		);

		//get all packs
		let packs = await packPayment.getAllPacks();
		console.dir(packs, { depth: null });

		//buy pack with native token
		await packPayment.buyPackWithNative(1, "ymc@ewtd.io", {
			value: ethers.parseUnits("100", 18),
		});
		await expect(
			packPayment.buyPackWithNative(1, "ymc@ewtd.io", {
				value: ethers.parseUnits("99", 18),
			})
		).to.be.revertedWithCustomError(packPayment, "PaymentNotEnough");

		packs = await packPayment.getAllPacks();
		console.dir(packs, { depth: null });

		//approve token
		await dummyToken.approve(
			await packPayment.getAddress(),
			ethers.parseUnits("100", 18)
		);

		//buy pack with erc20 token
		await packPayment.buyPackWithERC20(
			1,
			await dummyToken.getAddress(),
			"ymc@ewtd.io"
		);

		await expect(
			packPayment.buyPackWithERC20(
				1,
				await dummyToken.getAddress(),
				"ymc@ewtd.io"
			)
		).to.be.revertedWith("ERC20: insufficient allowance");

		await packPayment.buyPackWithNative(1, "ymc@ewtd.io", {
			value: ethers.parseUnits("100", 18),
		});
		packs = await packPayment.getAllPacks();
		console.dir(packs, { depth: null });

		await expect(
			packPayment.buyPackWithNative(1, "ymc@ewtd.io", {
				value: ethers.parseUnits("100", 18),
			})
		).to.be.revertedWithCustomError(packPayment, "OutOfStock");

		const ownerTokenBalance = await dummyToken.balanceOf(receiver.address);
		expect(ownerTokenBalance).to.be.equal(ethers.parseUnits("100", 18));
	});
});
