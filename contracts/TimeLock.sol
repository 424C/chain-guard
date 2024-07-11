// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TimeLock {
    address public beneficiary;
    uint256 public releaseTime;

    constructor(address _beneficiary, uint256 _durationInMonths) payable {
        require(_durationInMonths > 0, "Duration must be greater than 0");
        beneficiary = _beneficiary;
        releaseTime = block.timestamp + (_durationInMonths * 30 days);
    }

    function release() public {
        require(block.timestamp >= releaseTime, "Current time is before release time");
        payable(beneficiary).transfer(address(this).balance);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getRemainingTime() public view returns (uint256) {
        if (block.timestamp >= releaseTime) {
            return 0;
        }
        return releaseTime - block.timestamp;
    }
}