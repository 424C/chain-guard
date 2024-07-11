// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./ChainGuardEscrow.sol";

contract EscrowFactory {
    ChainGuardEscrow[] public escrows;

    event EscrowCreated(address escrowAddress, address arbiter, address depositor, address beneficiary, uint256 amount, uint256 duration);

    function createEscrow(address _arbiter, address payable _beneficiary, uint _durationInDays) public payable returns (ChainGuardEscrow) {
        ChainGuardEscrow newEscrow = new ChainGuardEscrow{value: msg.value}(_arbiter, payable(msg.sender), _beneficiary, _durationInDays);
        escrows.push(newEscrow);
        emit EscrowCreated(address(newEscrow), _arbiter, msg.sender, _beneficiary, msg.value, _durationInDays);
        return newEscrow;
    }

    function getEscrows() public view returns (ChainGuardEscrow[] memory) {
        return escrows;
    }
}