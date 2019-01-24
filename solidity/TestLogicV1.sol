pragma solidity ^0.4.21;

interface TestStorage {

}

contract TestLogicV1 {

    address public storageAddress;
    TestStorage storageContract;

    function setStorage(address _storage) public {
        storageAddress = _storage;
        storageContract = TestStorage(storageAddress);
    }

    function setNumber() public {
        storageContract.setLuckyNumber(5);
    }
}