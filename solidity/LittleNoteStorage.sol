pragma solidity ^0.4.21;


contract LittleNoteStorage {
    //This _storage only for new storage from upgraded function.
    KeyValueStorage _storage;

    //Existing main contract data for fast access
    //1) control data
    bool public initializedFlag = false;
    address public founder;
    address public admin;
    bool public haltFlag;

    //2) main config
    bool public AnybodyCanAddOtherUser;
    uint256 public MaxUserNameLength = 20;
    uint256 public MaxNoteLength = 140;
    uint256 public MaxFreeNoteCount = 1;

    uint256 public MinPrice = 25 * 10 ** 18;
    uint256 public MaxPrice = 4 * 10 ** 29;
    uint256 public ratio = 130;
    uint256 public MaxPresetPricePower = 100;

    uint256[] public PriceTable;

    uint256 public threshold = 16384 * 10 ** 18;

    //3) main data
    uint256 public potReserve = 0;
    uint256 public feesAndCharity = 0;
    uint256 public totalPurchase = 0;
    uint256 public developerAmount = 0;
    uint256 public lastPurchaseTime;
    uint256 public potDistCountLimit = 500;
    uint256 public potDistBasisPointLimit = 50;
    uint256 public mediaRate = 10;

    //lat and lng:
    //(1) both are turned into positive numbers by adding 360 to each.
    //(2) both will be multiplied by 10**16
    struct Note {
        string _id;
        address userAddress;
        string note;
        uint256 lat;
        uint256 lng;
        uint256 grid;
        uint256 grid10;
        bool forSell;
        uint256 purchasePrice;
        uint256 specialSellingRate;
        address referral;
        uint256 createdAt;
        bool mediaFlag;
        bool banFlag;
    }

    struct Account {
        address userAddress;
        bytes32 userName;
        uint256 noteNumber;
    }

    mapping (address => Account) public accounts;
    mapping (bytes32 => uint256) public accountsByUserName;
    address[] public accountsArray;

    mapping (bytes32 => Note) public notes;
    string[] public notesArray;
    uint256[] public notesArrayByTime;
    mapping (uint256 => uint256) public notesCountByGrid10;
    mapping (uint256 => string[]) public notesIdByGrid10;
    string[] public potNotesId;

    mapping (uint256 => uint256) public hourlyPotReserves;
    uint256[] public hourlyPotReservesArray;

    mapping (address => uint256) public investors;
    address[] public investorsArray; 
    uint256 public totalInvestment = 0;


    //We only have init functions here.
    function Init(address _founder) public {
        if (initializedFlag) {
            revert();
        }
        founder = _founder;
        haltFlag = false;
        InitPriceTable();
    }

    function FinishInitialization() public {
        initializedFlag = true;
    }

    function InitPriceTable() public {
        if (PriceTable.length > 0) {
            delete PriceTable;
        }
        uint256 price = MinPrice;
        for (uint i=0; i<=MaxPresetPricePower; i++) {
            PriceTable.push(price);
            price = multiplyByRatio(price);
            if (price > MaxPrice) {
                price = MaxPrice;
            }
        }
    }

    function multiplyByRatio(uint256 input) public returns (uint256) {
        uint256 output = input * ratio / 100;
        return output;
    }

    modifier onlyFounderOrAdmin() {
        require(msg.sender == founder || msg.sender == admin, "Sender is not founder or admin");
        _;
    }


}