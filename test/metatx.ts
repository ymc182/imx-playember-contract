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
		const forwarder = (await Forwarder.deploy()) as AnalyticsForwarder;
		const context = (await Context.deploy(
			await forwarder.getAddress()
		)) as AnalyticsContext;

		return {
			forwarder,
			context,
		};
	}

	describe("Deployment", function () {
		it("Should deploy", async function () {
			const { forwarder, context } = await loadFixture(deployBoosterKeyFixture);
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

			//call the doSomething function in the context contract
			const data = context.interface.encodeFunctionData("earnBadges");
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

			const req = {
				from: caller.address,
				to: await context.getAddress(),
				value: 0,
				gas: 1000000,
				nonce: 0,
				data: data,
			};
			console.log(" Caller", caller.address);
			const sig = await caller.signTypedData(domain, types, req);
			await expect(forwarder.execute(req, sig)).to.emit(
				context,
				"MetaTransactionExecuted"
			);
		});
	});
});
