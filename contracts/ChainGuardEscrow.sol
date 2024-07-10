// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ChainGuardEscrow is ReentrancyGuard {
    address public immutable arbiter;
    address public immutable depositor;
    address payable public immutable beneficiary;
    bool public isApproved;
    bool public isRefunded;

    event Approved(uint amount);
    event Refunded(uint amount);

    constructor(address _arbiter, address payable _beneficiary) payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        arbiter = _arbiter;
        depositor = msg.sender;
        beneficiary = _beneficiary;
    }

    function approve() external nonReentrant {
        require(msg.sender == arbiter, "Only arbiter can approve");
        require(!isApproved, "Already approved");
        require(!isRefunded, "Already refunded");
        
        uint balance = address(this).balance;
        require(balance > 0, "No funds to approve");
        
        isApproved = true;
        (bool sent, ) = beneficiary.call{value: balance}("");
        require(sent, "Failed to send Ether to beneficiary");
        
        emit Approved(balance);
    }

    function refund() external nonReentrant {
        require(msg.sender == arbiter, "Only arbiter can refund");
        require(!isApproved, "Already approved");
        require(!isRefunded, "Already refunded");
        
        uint balance = address(this).balance;
        require(balance > 0, "No funds to refund");
        
        isRefunded = true;
        (bool sent, ) = payable(depositor).call{value: balance}("");
        require(sent, "Failed to send Ether to depositor");
        
        emit Refunded(balance);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}