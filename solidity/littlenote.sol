pragma solidity ^0.4.22;
//Xinle Yang
//The full contract handling betting and rewarding.

contract LittleNote {

    address public founder;

    bool public haltFlag;
    bool public allAddOtherUser;
    uint256 public MaxUserNameLength = 20;
    uint256 public MaxNoteLength = 128;
    uint256 public MaxFreeNoteCount = 3;

    uint256 public MinPrice = 5 * 10 ** 18;
    uint256 public MaxPrice = 4 * 10 ** 29;
    uint256 public ratio = 135;
    uint256 public MaxPresetPricePower = 100;

    uint256[] public PriceTable;

    //lat and lng:
    //1) both are turned into positive numbers by adding 360 to each.
    //2) both will be multiplied by 10**16
    struct Note {
        string _id;
        address userAddress;
        string note;
        uint256 lat;
        uint256 lng;
        uint256 grid;
        uint256 grid10;
        bool forSell;
        uint256 createdAt;
    }

    struct Account {
        address userAddress;
        string userName;
        uint256 noteNumber;
    }

    mapping (address => Account) public accounts;
    mapping (string => uint256) public accountsByUserName;
    address[] public accountsArray;

    mapping (string => Note) public notes;
    string[] public notesArray;
    mapping (uint256 => uint256) public notesCountByGrid10;

    // struct Team {
    //     uint256 teamNumber;
    //     string teamName;
    //     uint256 totalContributions;
    // }

    // struct Contribution {
    //     address contributor;
    //     uint256 id;
    //     uint256 contribution;
    //     uint256 timestamp;
    // }

    // address[] public allContributors;
    // mapping (address => uint256) public allContributorsMap;
    // mapping (address => uint256) public contributorsAccountBonus;
    // mapping (address => uint256) public contributorsEarlyBonus;
    // mapping (address => uint256) public contributorsTopBonus;
    // address[] public allWinners;
    // mapping (address => uint256) public allWinnersMap;

    // mapping (uint256 => Team) public teams;
    // mapping (address => mapping(uint256 => uint256)) public teamsContributions;
    // mapping (address => mapping(uint256 => uint256)) public teamsContributionsSent;
    // mapping (uint256 => Match) public matches;
    // mapping (address => mapping(uint256 => uint256)) public matchesContributions;
    // mapping (address => mapping(uint256 => uint256)) public matchesContributionsSent;
    
    // uint256 public championJackpot;
    // bool public championRewardSent;
    
    // uint256 championNumber;

    // event sndMsg(string message);



    constructor() public {
        founder = msg.sender;
        haltFlag = false;
        initPriceTable();
    }

    function SetHalt(bool halt) public {
        if (msg.sender != founder) revert();
        haltFlag = halt;
    }

    function SetFounder(address newFounder) public returns (bool) {
        if (msg.sender != founder) revert();
        founder = newFounder;
        return true;
    }

    function AddAccount(string userName, address userAddress) public returns (bool) {
        if (bytes(userName).length > MaxUserNameLength) {
            revert();
        }
        if (msg.sender != userAddress && (msg.sender != newFounder && !allAddOtherUser) {
            revert();
        }
        if (accounts[userAddress] == 0 && accountsByUserName[userName] == 0) {
            accounts[userAddress].userAddress = userAddress;
            accounts[userAddress].userName = userName;
            accounts[userAddress].noteNumber = 0;
            uint256 length = accountsArray.push(userAddress);
            accountsByUserName[userName] = length; //length is (index + 1)
            return true;
        } else {
            return false;
        }
    }

    function AddNote(string noteText, uint256 lat, uint256 lng, address _id, bool forSell) public payable {
        if (accounts[msg.sender] == 0 || bytes(noteText).length > MaxNoteLength) {
            revert();
        }
        uint256 grid10 = getGrid10(lat, lng);
        bool freeFlag = true;
        if (notesCountByGrid10[grid10] > 0 || accounts[msg.sender].noteNumber > MaxFreeNoteCount) {
            freeFlag = false;
        }
        bool newFlag = true;
        uint256 price = getPrice(freeFlag, grid10, newFlag);
        if (!freeFlag && msg.value < price) {
            revert();
        }
        if (notes[_id] == 0) {
            string grid = getGrid(lat, lng);
            notesArray.push(_id);
            notes[_id]._id = _id;
            notes[_id].userAddress = msg.sender;
            notes[_id].note = noteText;
            notes[_id].lat = lat;
            notes[_id].lng = lng;
            notes[_id].grid = grid;
            notes[_id].grid10 = grid10;
            notes[_id].forSell = forSell;
            notes[_id].createdAt = now;
            notesCountByGrid10[grid10]++;
        }
    }

    function BuyNote(string noteText, uint256 lat, uint256 lng, string _id, bool forSell) public payable {
        if (notes[_id] == 0 || !notes[_id].forSell || accounts[msg.sender] == 0 || bytes(noteText).length > MaxNoteLength) {
            revert();
        }
        uint256 grid10 = getGrid10(lat, lng);
        bool freeFlag = true;
        if (notesCountByGrid10[grid10] > 0 || accounts[msg.sender].noteNumber > MaxFreeNoteCount) {
            freeFlag = false;
        }
        bool newFlag = false;
        uint256 price = getPrice(freeFlag, grid10, newFlag);
        if (!freeFlag && msg.value < price) {
            revert();
        } else {
            transfer
        }
        uint256 grid = getGrid(lat, lng);
        notes[_id]._id = _id;
        notes[_id].userAddress = msg.sender;
        notes[_id].note = noteText;
        notes[_id].lat = lat;
        notes[_id].lng = lng;
        notes[_id].grid = grid;
        notes[_id].grid10 = grid10;
        notes[_id].forSell = forSell;
        notes[_id].createdAt = now;
    }

    function ToggleSell(string _id, bool forSell) public {
        if (notes[_id] == 0) {
            revert();
        }
        Note note = notes[_id];
        if (note.userAddress != userAddress || note.userAddress != founder) {
            revert();
        }
        note.forSell = forSell;
    }

    function EditNote(string noteText, uint256 lat, uint256 lng, string _id, bool forSell) public {
        if (msg.sender != founder || notes[_id] == 0) {
            revert();
        }
        notes[_id].note = noteText;
        notes[_id].forSell = forSell;
        notes[_id].createdAt = now;
    }

    function getGrid10(uint256 lat, uint256 lng) public returns (uint256) {
        uint256 grid10 = lat/100000000000000*100000 + lng/100000000000000;
        return grid10;
    }

    function getGrid(uint256 lat, uint256 lng) public returns (uint256) {
        uint256 grid = lat/10000000000000*1000000 + lng/10000000000000;
        return grid;
    }

    function getPrice(bool freeFlag, bool newFlag, uint grid10) public returns (uint256) {
        uint256 count = notesCountByGrid10[grid10];

        if (newFlag) {
            if (count == 0) {
                if (freeFlag) {
                    return 0;
                } else {
                    return MinPrice;
                }
            } else {
                count++;
            }
        } else {
            if (count == 0) {
                count++;
            }
        }

        uint256 price = 0;
        if (count <= MaxPresetPricePower && PriceTable.length > count) {
            price = PriceTable[count];
        } else {
            price = getBigPrice(count - MaxPresetPricePower);
        }

        return price;
    }

    function initPriceTable() public {
        if (PriceTable.length > 0) {
            delete PriceTable;
        }
        uint256 price = MinPrice;
        for (uint i=0; i<=MaxPresetPricePower; i++) {
            PriceTable.push(price);
            price = multiplyByRatio(price);
        }
    }

    function getBigPrice(uint n) public returns (uint256) {
        if (PriceTable.length <= MaxPresetPricePower) {
            initPriceTable();
        }
        uint256 price = PriceTable[MaxPresetPricePower];
        for (uint256 i=0; i<n; i++) {
            price = price * ratio / 100;
        }
        return price;
    }

    function multiplyByRatio(uint256 input) public returns (uint256) {
        uint256 output = input * ratio / 100;
        return output;
    }

    function ManualTransfer(uint256 amount, address to) public {
        if (msg.sender != founder) revert();

        to.transfer(amount);
    }

    function SafetySendout(uint256 amount) public {
        if (msg.sender != founder) revert();

        founder.transfer(amount);
    }

    function () public payable {
    }

    //TODO: more to add
}
