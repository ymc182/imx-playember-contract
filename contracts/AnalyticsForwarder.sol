// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/metatx/MinimalForwarder.sol";

contract AnalyticsForwarder is MinimalForwarder {
    event MetaTransactionExecuted(
        address indexed from,
        address indexed to,
        bytes indexed data
    );

    constructor() MinimalForwarder() {}
}
