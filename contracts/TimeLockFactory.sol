// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./TimeLock.sol";

contract TimeLockFactory {
    event TimeLockCreated(address timeLockAddress, address beneficiary, uint256 amount, uint256 duration);

    TimeLock[] public timeLocks;

    function createTimeLock(uint256 _durationInMonths) public payable {
        TimeLock newTimeLock = new TimeLock{value: msg.value}(msg.sender, _durationInMonths);
        timeLocks.push(newTimeLock);
        emit TimeLockCreated(address(newTimeLock), msg.sender, msg.value, _durationInMonths);
    }

    function getTimeLocks() public view returns (TimeLock[] memory) {
        return timeLocks;
    }
}