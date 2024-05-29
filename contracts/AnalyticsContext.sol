// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "hardhat/console.sol";

contract AnalyticsContext is ERC2771Context {
    constructor(address trustedForwarder) ERC2771Context(trustedForwarder) {}

    event MetaTransactionExecuted(
        address indexed from,
        address indexed to,
        bytes indexed data
    );

    function earnBadges() external {
        emit MetaTransactionExecuted(_msgSender(), address(this), _msgData());
    }

    // Override _msgSender() to return the sender of this meta-transaction
    function _msgSender() internal view override returns (address sender) {
        return ERC2771Context._msgSender();
    }

    // Override _msgData() to return the calldata of this meta-transaction
    function _msgData() internal view override returns (bytes calldata) {
        return ERC2771Context._msgData();
    }
}
