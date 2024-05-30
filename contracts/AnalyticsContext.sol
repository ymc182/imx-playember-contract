// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract AnalyticsContext is ERC2771Context {
    constructor(address trustedForwarder) ERC2771Context(trustedForwarder) {}

    event MetaTransactionExecuted(
        address indexed receiver,
        string analysisCode
    );

    function earnBadges(address receiver) external {
        emit MetaTransactionExecuted(receiver, "earnBadges");
    }

    function dailyReward(address receiver) external {
        emit MetaTransactionExecuted(receiver, "dailyReward");
    }

    // Override _msgSender() to return the sender of this meta-transaction
    function _msgSender() internal view override returns (address sender) {
        return ERC2771Context._msgSender();
    }

    // Override _msgData() to return the calldata of this meta-transaction
    function _msgData() internal view override returns (bytes calldata) {
        return ERC2771Context._msgData();
    }

    function isTrustedForwarder(
        address forwarder
    ) public view override returns (bool) {
        return ERC2771Context.isTrustedForwarder(forwarder);
    }
}
