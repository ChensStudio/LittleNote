pragma solidity ^0.4.21;

import "./TestStorage.sol"

interface TestStorage {

}

contract TestMain {

    event Upgraded(address indexed implementation);

    address public _implementation;
    address public storageAddress;
    TestStorage storageContract;

    address public owner;
    address public admin;

    function TestMain() public {
        owner = msg.sender;
    }

    modifier onlyOwnerOrAdmin() {
        require(msg.sender == owner || msg.sender == admin, "Sender is not owner or admin");
        _;
    }

    function setOwner(address _owner) public onlyOwnerOrAdmin {
        owner = _owner;
    }

    function setAdmin(address _admin) public onlyOwnerOrAdmin {
        admin = _admin;
    }
 
    function implementation() public view returns (address) {
        return _implementation;
    }

    function setStorageContract(address _storage) public onlyOwnerOrAdmin {
        storageAddress = _storage;
        storageContract = TestStorage(storageAddress);
    }

    function upgradeTo(address impl) public onlyOwnerOrAdmin {
        require(
            _implementation != impl,
            "Cannot upgrade to the same implementation."
        );
        _implementation = impl;
        emit Upgraded(impl);
    }
  
    function () public payable {
        address _impl = implementation();
        require(
            _impl != address(0),
            "Cannot set implementation to address(0)"
        );
        bytes memory data = msg.data;

        assembly {
          let result := delegatecall(gas, _impl, add(data, 0x20), mload(data), 0, 0)
          let size := returndatasize
          let ptr := mload(0x40)
          returndatacopy(ptr, 0, size)
          switch result
          case 0 { revert(ptr, size) }
          default { return(ptr, size) }
        }
    }
}
