// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AnalyticsBase {
    constructor() {}

    event AnalyticsEvent(address indexed receiver, string analysisCode);

    function earnBadges() external {
        emit AnalyticsEvent(msg.sender, "earnBadges");
    }

    function dailyReward() external {
        emit AnalyticsEvent(msg.sender, "dailyReward");
    }
}
