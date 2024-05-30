import hre, { ethers } from "hardhat";
import { AnalyticsForwarder, AnalyticsContext } from "../../../typechain-types";

async function main() {
	const forwarderAddress = "0x20FF9f42Deba8b3e722e9375Ca0AA02E2813A9Da";
	const contextAddress = "0x74FA3291dEF041ea376884d9adE166e25f6F7A22";

	const Forwarder = await hre.ethers.getContractFactory("AnalyticsForwarder");
	const Context = await hre.ethers.getContractFactory("AnalyticsContext");

	const forwarder = Forwarder.attach(forwarderAddress) as AnalyticsForwarder;
	const context = Context.attach(contextAddress) as AnalyticsContext;
	const [deployer, caller] = await hre.ethers.getSigners();
	const chainId = await hre.ethers.provider.getNetwork().then((n) => n.chainId);
	const domain = {
		name: "MinimalForwarder",
		version: "0.0.1",
		chainId,
		verifyingContract: await forwarder.getAddress(),
	};

	//call the doSomething function in the context contract

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
	for (let i = 0; i < 100; i++) {
		const randomCaller = ethers.Wallet.createRandom();
		const functionData = context.interface.encodeFunctionData("earnBadges", [
			randomCaller.address,
		]);
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

	console.log("MetaTransactionExecuted event emitted");
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
