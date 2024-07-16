// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AnalyticsBase {
    constructor() {}

    event AnalyticsEvent(address indexed receiver, string analysisCode);

    function gameEventExecute(string calldata _analysisCode) external {
        emit AnalyticsEvent(msg.sender, _analysisCode);
    }
}
