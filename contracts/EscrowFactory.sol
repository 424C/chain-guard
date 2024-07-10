// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./ChainGuardEscrow.sol";

contract EscrowFactory {
    event EscrowCreated(address indexed escrowAddress, address indexed arbiter, address indexed beneficiary, uint256 amount);

    ChainGuardEscrow[] public escrows;

    function createEscrow(address _arbiter, address payable _beneficiary) public payable returns (ChainGuardEscrow) {
        ChainGuardEscrow newEscrow = new ChainGuardEscrow{value: msg.value}(_arbiter, _beneficiary);
        escrows.push(newEscrow);
        emit EscrowCreated(address(newEscrow), _arbiter, _beneficiary, msg.value);
        return newEscrow;
    }

    function getEscrows() public view returns (ChainGuardEscrow[] memory) {
        return escrows;
    }
}