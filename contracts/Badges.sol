// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@imtbl/contracts/contracts/token/erc721/preset/ImmutableERC721.sol";
error TokenSoulbound();

contract Badges is ImmutableERC721 {
    /// @dev Mapping from token Id to badge Id
    mapping(uint256 => uint256) public tokenIdBadgeId;
    /// @dev Mapping from badge Id to badge metadata
    mapping(uint256 => string) public badgeIdMetadata;
    uint256 badgeCount;
    uint256 supply;

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
    {
        supply = 1;
        badgeIdMetadata[1] = "ROOKIE_1";
        badgeIdMetadata[2] = "ROOKIE_2";
        badgeIdMetadata[3] = "ROOKIE_3";
        badgeIdMetadata[4] = "CHALLENGER_1";
        badgeIdMetadata[5] = "CHALLENGER_2";
        badgeIdMetadata[6] = "CHALLENGER_3";
        badgeIdMetadata[7] = "APPENTICE_1";
        badgeIdMetadata[8] = "APPENTICE_2";
        badgeIdMetadata[9] = "APPENTICE_3";
        badgeIdMetadata[10] = "VETERAN_1";
        badgeIdMetadata[11] = "VETERAN_2";
        badgeIdMetadata[12] = "VETERAN_3";
        badgeIdMetadata[13] = "EXPERT_1";
        badgeIdMetadata[14] = "EXPERT_2";
        badgeIdMetadata[15] = "EXPERT_3";
        badgeIdMetadata[16] = "LEGEND_1";
        badgeIdMetadata[17] = "LEGEND_2";
        badgeIdMetadata[18] = "LEGEND_3";
        badgeIdMetadata[19] = "CHAMPION_1";
        badgeIdMetadata[20] = "CHAMPION_2";
        badgeIdMetadata[21] = "CHAMPION_3";
        badgeIdMetadata[22] = "SUPREME_1";
        badgeIdMetadata[23] = "SUPREME_2";
        badgeIdMetadata[24] = "SUPREME_3";
        badgeIdMetadata[25] = "GOD_1";
        badgeIdMetadata[26] = "GOD_2";
        badgeIdMetadata[27] = "GOD_3";
        badgeIdMetadata[28] = "ULTIMATE_1";
        badgeIdMetadata[29] = "ULTIMATE_2";
        badgeIdMetadata[30] = "ULTIMATE_3";
        badgeIdMetadata[31] = "MAESTRO_1";
        badgeIdMetadata[32] = "MAESTRO_2";
        badgeIdMetadata[33] = "MAESTRO_3";
        badgeIdMetadata[34] = "GRANDMASTER_1";
        badgeCount = 34;
    }

    function minterBurn(uint256 tokenId) external onlyRole(MINTER_ROLE) {
        _burn(tokenId);
    }

    //override approve and approveForAll to prevent dead listing
    function approve(address to, uint256 tokenId) public pure override {
        revert TokenSoulbound();
    }

    function batchMintBadges(
        address[] calldata recipients,
        uint256[] calldata badgeIds
    ) external onlyRole(MINTER_ROLE) {
        require(recipients.length == badgeIds.length, "Invalid input");
        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], supply);
            require(badgeIds[i] <= badgeCount, "Invalid badge ID");
            string memory metadata = badgeIdMetadata[badgeIds[i]];
            require(bytes(metadata).length > 0, "Invalid badge ID");
            tokenIdBadgeId[supply] = badgeIds[i];
            supply++;
        }
    }

    function mintBadge(
        address to,
        uint256 badgeId
    ) external onlyRole(MINTER_ROLE) {
        _mint(to, supply);
        require(badgeId <= badgeCount, "Invalid badge ID");
        string memory metadata = badgeIdMetadata[badgeId];
        require(bytes(metadata).length > 0, "Invalid badge ID");
        tokenIdBadgeId[supply] = badgeId;
        supply++;
    }

    function setApprovalForAll(
        address operator,
        bool approved
    ) public pure override {
        revert TokenSoulbound();
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        return
            string(
                abi.encodePacked(
                    baseURI,
                    badgeIdMetadata[tokenIdBadgeId[tokenId]],
                    ".json"
                )
            );
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        if (!hasRole(MINTER_ROLE, msg.sender)) {
            revert TokenSoulbound();
        }
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function minterBurnBatch(
        uint256[] calldata tokenIDs
    ) external onlyRole(MINTER_ROLE) {
        for (uint256 i = 0; i < tokenIDs.length; i++) {
            _burn(tokenIDs[i]);
        }
    }

    function getBadgeIdMetadata(
        uint256 badgeId
    ) external view returns (string memory) {
        return badgeIdMetadata[badgeId];
    }

    function addBadge(
        string memory metadata
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        badgeCount++;
        badgeIdMetadata[badgeCount] = metadata;
    }

    function modifyBadge(
        uint256 badgeId,
        string memory metadata
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        badgeIdMetadata[badgeId] = metadata;
    }
}
