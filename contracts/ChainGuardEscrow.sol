// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ChainGuardEscrow {
    address public arbiter;
    address payable public depositor;
    address payable public beneficiary;
    uint public creationTime;
    uint public duration;
    enum State { Pending, Approved, Refunded }
    State public state;

    constructor(address _arbiter, address payable _depositor, address payable _beneficiary, uint _durationInDays) payable {
        require(_arbiter != address(0) && _depositor != address(0) && _beneficiary != address(0), "Invalid addresses");
        require(_durationInDays > 0, "Duration must be greater than 0");
        arbiter = _arbiter;
        depositor = _depositor;
        beneficiary = _beneficiary;
        creationTime = block.timestamp;
        duration = _durationInDays * 1 days;
        state = State.Pending;
    }

    function approve() external {
        require(msg.sender == arbiter, "Only arbiter can approve");
        require(state == State.Pending, "Not in pending state");
        uint balance = address(this).balance;
        (bool sent, ) = beneficiary.call{value: balance}("");
        require(sent, "Failed to send Ether");
        state = State.Approved;
    }

    function refund() external {
        require(msg.sender == arbiter || (msg.sender == depositor && block.timestamp >= creationTime + duration), "Not authorized to refund");
        require(state == State.Pending, "Not in pending state");
        uint balance = address(this).balance;
        (bool sent, ) = depositor.call{value: balance}("");
        require(sent, "Failed to send Ether");
        state = State.Refunded;
    }

    function getState() public view returns (State) {
        return state;
    }

    function getRemainingTime() public view returns (uint) {
        if (block.timestamp >= creationTime + duration) {
            return 0;
        }
        return (creationTime + duration) - block.timestamp;
    }
}