// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@imtbl/contracts/contracts/token/erc1155/preset/ImmutableERC1155.sol";
error TokenSoulbound();

contract Ticket is ImmutableERC1155 {
    constructor(
        address owner,
        string memory name,
        string memory baseURI,
        string memory contractURI,
        address operatorAllowlist,
        address royaltyReceiver,
        uint96 feeNumerator
    )
        ImmutableERC1155(
            owner,
            name,
            baseURI,
            contractURI,
            operatorAllowlist,
            royaltyReceiver,
            feeNumerator
        )
    {}

    function setApprovalForAll(
        address operator,
        bool approved
    ) public pure override {
        revert TokenSoulbound();
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override {
        if (!hasRole(MINTER_ROLE, msg.sender)) revert TokenSoulbound();
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
