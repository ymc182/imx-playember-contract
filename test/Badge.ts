import {
	time,
	loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("Test", function () {
	// We define a fixture to reuse the same setup in every test.
	// We use loadFixture to run this setup once, snapshot that state,
	// and reset Hardhat Network to that snapshot in every test.
	async function deployBoosterKeyFixture() {
		const [deployer] = await hre.ethers.getSigners();
		const BoosterKey = await hre.ethers.getContractFactory("BoosterKey");
		const boosterKey = await BoosterKey.deploy(
			deployer.address,
			"BoosterKey",
			"KEY",
			"https://dev-store.ewtd-ipfs.net/key/",
			"https://store.ewtd-ipfs.net/key-collection.json",
			"0x6b969FD89dE634d8DE3271EbE97734FEFfcd58eE",
			"0xe163065978d9dB0CFa763cbeFcD5A9918bBbe116",
			"500"
		);
		return {
			boosterKey,
		};
	}
	async function deployBabyEmbyFixture() {
		const [deployer] = await hre.ethers.getSigners();
		const BabyEmby = await hre.ethers.getContractFactory("BabyEmby");
		const babyEmby = await BabyEmby.deploy(
			deployer.address,
			"BoosterKey",
			"KEY",
			"https://dev-store.ewtd-ipfs.net/key/",
			"https://store.ewtd-ipfs.net/key-collection.json",
			"0x6b969FD89dE634d8DE3271EbE97734FEFfcd58eE",
			"0xe163065978d9dB0CFa763cbeFcD5A9918bBbe116",
			"500"
		);

		await babyEmby.grantMinterRole(deployer.address);

		return {
			babyEmby,
		};
	}

	describe("Deployment", function () {
		it("Should deploy", async function () {
			const { babyEmby } = await loadFixture(deployBabyEmbyFixture);
		});

		it("not transferrable", async function () {
			const { babyEmby } = await loadFixture(deployBabyEmbyFixture);
			const [sender, receiver] = await hre.ethers.getSigners();

			await babyEmby.mint(receiver.address, 1);

			await expect(
				babyEmby
					.connect(receiver)
					.transferFrom(receiver.address, sender.address, 1)
			).to.be.revertedWithoutReason();
		});
	});
});
