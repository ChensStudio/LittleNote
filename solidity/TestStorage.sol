pragma solidity ^0.4.21;


contract TestStorage {

    uint256 public luckyNumber;
    address public owner;
    address public admin;
    address public trustedContract;

    mapping(bytes32 => uint256) _uintStorage;
    mapping(bytes32 => address) _addressStorage;
    mapping(bytes32 => bool) _boolStorage;
    mapping(bytes32 => bytes32) _bytesStorage;

    function TestStorage() public {
        owner = msg.sender;
    }

    modifier onlyOwnerOrAdmin() {
        require(msg.sender == owner || msg.sender == admin, "Sender is not owner or admin");
        _;
    }

    modifier onlyTrusted() {
        require(msg.sender == owner || msg.sender == admin || msg.sender == trustedContract, "Sender is not owner, admin or trusted contract");
        _;
    }

    function SetOwner(address _owner) public onlyOwnerOrAdmin {
        owner = _owner;
    }

    function SetAdmin(address _admin) public onlyOwnerOrAdmin {
        admin = _admin;
    }

    function SetTrustedContract(address _contract) public onlyOwnerOrAdmin {
        trustedContract = _contract;
    }

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

    function setAddress(bytes32 key, address value) public onlyTrusted {
        _addressStorage[key] = value;
    }

    function setUint(bytes32 key, uint value) public onlyTrusted {
        _uintStorage[key] = value;
    }

    function setBool(bytes32 key, bool value) public onlyTrusted {
        _boolStorage[key] = value;
    }

    function setBytes(bytes32 key, bytes32 value) public onlyTrusted {
        _bytesStorage[key] = value;
    }

    /**** Delete Methods ***********/

    function deleteAddress(bytes32 key) public onlyTrusted {
        delete _addressStorage[key];
    }

    function deleteUint(bytes32 key) public onlyTrusted {
        delete _uintStorage[key];
    }

    function deleteBool(bytes32 key) public onlyTrusted {
        delete _boolStorage[key];
    }

    function deleteBytes(bytes32 key) public onlyTrusted {
        delete _bytesStorage[key];
    }

    //==============================================
    //variable setters/getters
    //==============================================

    function SetLuckyNumber(uint256 _luckyNumber) public onlyTrusted {
        luckyNumber = _luckyNumber;
    }

    function GetLuckNumber() public returns (uint256) {
        return luckyNumber;
    }



}