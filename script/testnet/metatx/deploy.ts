import {
	time,
	loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { AnalyticsContext, AnalyticsForwarder } from "../../../typechain-types";

async function main() {
	const [deployer] = await hre.ethers.getSigners();
	const Forwarder = await hre.ethers.getContractFactory("AnalyticsForwarder");
	const Context = await hre.ethers.getContractFactory("AnalyticsContext");
	const forwarder = (await Forwarder.deploy(
		deployer.address
	)) as AnalyticsForwarder;

	const context = (await Context.deploy(
		await forwarder.getAddress()
	)) as AnalyticsContext;

	console.log("Forwarder deployed to:", await forwarder.getAddress());
	console.log("Context deployed to:", await context.getAddress());
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
