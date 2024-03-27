// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@imtbl/contracts/contracts/token/erc20/ImmutableERC20.sol";

contract USDC is ImmutableERC20 {
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply
    ) ImmutableERC20(name_, symbol_) {
        _mint(msg.sender, initialSupply);
    }
}
