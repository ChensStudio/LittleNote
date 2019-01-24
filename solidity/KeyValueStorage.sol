pragma solidity ^0.4.21;

contract KeyValueStorage {

  mapping(bytes32 => uint256) _uintStorage;
  mapping(bytes32 => address) _addressStorage;
  mapping(bytes32 => bool) _boolStorage;
  mapping(bytes32 => bytes32) _bytesStorage;

  /**** Get Methods ***********/

  function getAddress(bytes32 key) public view returns (address) {
      return _addressStorage[key];
  }

  function getUint(bytes32 key) public view returns (uint) {
      return _uintStorage[key];
  }

  function getBool(bytes32 key) public view returns (bool) {
      return _boolStorage[key];
  }

  function getBytes(bytes32 key) public view returns (bytes32) {
      return _bytesStorage[key];
  }

  /**** Set Methods ***********/

  function setAddress(bytes32 key, address value) public {
    _addressStorage[key] = value;
  }

  function setUint(bytes32 key, uint value) public {
      _uintStorage[key] = value;
  }

  function setBool(bytes32 key, bool value) public {
      _boolStorage[key] = value;
  }

  function setBytes(bytes32 key, bytes32 value) public {
      _bytesStorage[key] = value;
  }

  /**** Delete Methods ***********/

  function deleteAddress(bytes32 key) public {
      delete _addressStorage[key];
  }

  function deleteUint(bytes32 key) public {
      delete _uintStorage[key];
  }

  function deleteBool(bytes32 key) public {
      delete _boolStorage[key];
  }

  function deleteBytes(bytes32 key) public {
      delete _bytesStorage[key];
  }

}
