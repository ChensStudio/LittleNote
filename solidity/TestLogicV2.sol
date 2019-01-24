pragma solidity ^0.4.21;

contract TestLogicV2 is TestStorage {
    function setNumber() public {
        luckyNumber = 7;
    }
}