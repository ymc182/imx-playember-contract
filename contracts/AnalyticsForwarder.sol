// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/metatx/MinimalForwarder.sol";

contract AnalyticsForwarder is MinimalForwarder {
    address public trustedSigner;

    event MetaTransactionExecuted(
        address indexed from,
        address indexed to,
        bytes indexed data
    );

    constructor(address _trustedSigner) MinimalForwarder() {
        trustedSigner = _trustedSigner;
    }

    function batchExecuteMetaTransaction(
        ForwardRequest[] calldata reqs,
        bytes[] calldata signatures
    ) external {
        require(reqs.length == signatures.length, "Mismatched array lengths");

        for (uint256 i = 0; i < reqs.length; i++) {
            this.execute(reqs[i], signatures[i]);
        }
    }
}
