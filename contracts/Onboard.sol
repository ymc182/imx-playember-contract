// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Onboard is Ownable {
    constructor() Ownable() {}

    error MismatchedArrayLengths();
    error InsufficientFunds();

    function onBoard(
        address payable[] calldata wallets,
        uint256[] calldata amounts
    ) external payable onlyOwner {
        if (wallets.length != amounts.length) {
            revert MismatchedArrayLengths();
        }

        uint256 totalAmount = msg.value;

        for (uint256 i = 0; i < wallets.length; i++) {
            if (totalAmount < amounts[i]) {
                revert InsufficientFunds();
            }
            totalAmount -= amounts[i];
            (bool success, ) = wallets[i].call{value: amounts[i]}("");
            require(success, "Transfer failed.");
        }
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
