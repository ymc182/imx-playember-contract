import {
	time,
	loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { AnalyticsContext, AnalyticsForwarder } from "../typechain-types";

describe("Test", function () {
	// We define a fixture to reuse the same setup in every test.
	// We use loadFixture to run this setup once, snapshot that state,
	// and reset Hardhat Network to that snapshot in every test.
	async function deployBoosterKeyFixture() {
		const [deployer] = await hre.ethers.getSigners();
		const Forwarder = await hre.ethers.getContractFactory("AnalyticsForwarder");
		const Context = await hre.ethers.getContractFactory("AnalyticsContext");
		const forwarder = (await Forwarder.deploy(
			deployer.address
		)) as AnalyticsForwarder;
		const badForwarder = (await Forwarder.deploy(
			deployer.address
		)) as AnalyticsForwarder;
		const context = (await Context.deploy(
			await forwarder.getAddress()
		)) as AnalyticsContext;

		return {
			forwarder,
			context,
			badForwarder,
		};
	}

	describe("Deployment", function () {
		it("Should deploy", async function () {
			const { forwarder, context, badForwarder } = await loadFixture(
				deployBoosterKeyFixture
			);
			const [deployer, caller] = await hre.ethers.getSigners();

			const chainId = await hre.ethers.provider
				.getNetwork()
				.then((n) => n.chainId);

			const domain = {
				name: "MinimalForwarder",
				version: "0.0.1",
				chainId,
				verifyingContract: await forwarder.getAddress(),
			};

			const types = {
				ForwardRequest: [
					{ name: "from", type: "address" },
					{ name: "to", type: "address" },
					{ name: "value", type: "uint256" },
					{ name: "gas", type: "uint256" },
					{ name: "nonce", type: "uint256" },
					{ name: "data", type: "bytes" },
				],
			};

			const reqs = [];
			const sigs = [];
			for (let i = 0; i < 10; i++) {
				const randomCaller = ethers.Wallet.createRandom();
				const functionData = context.interface.encodeFunctionData(
					"earnBadges",
					[randomCaller.address]
				);
				const req = {
					from: randomCaller.address,
					to: await context.getAddress(),
					value: 0,
					gas: 5000,
					nonce: 0,
					data: functionData,
				};
				reqs.push(req);
				const sig = await randomCaller.signTypedData(domain, types, req);
				sigs.push(sig);
			}

			await forwarder.batchExecuteMetaTransaction(reqs, sigs);
		});
	});
});
