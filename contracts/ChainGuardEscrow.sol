// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ChainGuardEscrow {
    address public arbiter;
    address payable public depositor;
    address payable public beneficiary;
    uint public creationTime;
    uint public duration;
    bool public isApproved;

    constructor(address _arbiter, address payable _depositor, address payable _beneficiary, uint _durationInDays) payable {
        arbiter = _arbiter;
        depositor = _depositor;
        beneficiary = _beneficiary;
        creationTime = block.timestamp;
        duration = _durationInDays * 1 days;
    }

    function approve() external {
        require(msg.sender == arbiter, "Only arbiter can approve");
        uint balance = address(this).balance;
        (bool sent, ) = beneficiary.call{value: balance}("");
        require(sent, "Failed to send Ether");
        isApproved = true;
    }

    function refund() external {
        require(msg.sender == arbiter || (msg.sender == depositor && block.timestamp >= creationTime + duration), "Not authorized to refund");
        require(!isApproved, "Already approved");
        uint balance = address(this).balance;
        (bool sent, ) = depositor.call{value: balance}("");
        require(sent, "Failed to send Ether");
    }

    function getRemainingTime() public view returns (uint) {
        if (block.timestamp >= creationTime + duration) {
            return 0;
        }
        return (creationTime + duration) - block.timestamp;
    }
}