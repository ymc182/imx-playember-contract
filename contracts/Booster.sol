// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@imtbl/contracts/contracts/token/erc721/preset/ImmutableERC721.sol";

contract Booster is ImmutableERC721 {
    constructor(
        address owner,
        string memory name,
        string memory symbol,
        string memory baseURI,
        string memory contractURI,
        address royaltyAllowlist,
        address _receiver,
        uint96 _feeNumerator
    )
        ImmutableERC721(
            owner,
            name,
            symbol,
            baseURI,
            contractURI,
            royaltyAllowlist,
            _receiver,
            _feeNumerator
        )
    {}

    function minterBurn(uint256 tokenId) external onlyRole(MINTER_ROLE) {
        _burn(tokenId);
    }

    function minterBurnBatch(
        uint256[] calldata tokenIDs
    ) external onlyRole(MINTER_ROLE) {
        for (uint256 i = 0; i < tokenIDs.length; i++) {
            _burn(tokenIDs[i]);
        }
    }
}
