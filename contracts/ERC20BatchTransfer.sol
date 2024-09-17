// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20BatchTransfer {
    constructor() {}

    error MismatchedArrayLengths();
    error InsufficientFunds();

    function batchTransfer(
        ERC20 token,
        address[] calldata _to,
        uint256[] calldata _amounts
    ) external {
        if (_to.length != _amounts.length) {
            revert MismatchedArrayLengths();
        }

        for (uint256 i = 0; i < _to.length; i++) {
            if (_amounts[i] == 0) continue;
            if (token.balanceOf(address(msg.sender)) < _amounts[i]) {
                revert InsufficientFunds();
            }
            token.transferFrom(msg.sender, _to[i], _amounts[i]);
        }
    }
}
