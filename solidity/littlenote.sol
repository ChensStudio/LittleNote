pragma solidity ^0.4.22;
//Xinle Yang
//The full contract handling betting and rewarding.

contract LittleNote {

    address public founder;

    bool public haltFlag;
    bool public anybodyAddOtherUser;
    uint256 public MaxUserNameLength = 20;
    uint256 public MaxNoteLength = 128;
    uint256 public MaxFreeNoteCount = 3;

    uint256 public MinPrice = 5 * 10 ** 18;
    uint256 public MaxPrice = 4 * 10 ** 29;
    uint256 public ratio = 135;
    uint256 public MaxPresetPricePower = 100;

    uint256[] public PriceTable;

    uint256 public potReserve = 0;
    uint256 public threshold = 0;
    uint256 public totalPurchase = 0;
    uint256 public developerAmount = 0;
    uint256 public lastPurchaseTime;

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
        uint256 purchasePrice;
        address referral;
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
    mapping (uint256 => string[]) public notesIdByGrid10;
    string[] public potNotesId;

    mapping (uint256 => uint256) public hourlyPotReserves;

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
        if (msg.sender != userAddress && (msg.sender != newFounder && !anybodyAddOtherUser) {
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

    function AddNote(string noteText, uint256 lat, uint256 lng, address _id, bool forSell, address referral) public payable {
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
        } else {
            distributePayment(referral, grid10, 0, 0);
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
            notes[_id].referral = referral;
            notes[_id].createdAt = now;
            lastPurchaseTime = now;
            notesCountByGrid10[grid10]++;
            string[] notesId = notesIdByGrid10[grid10];
            notesId.push(_id);
            notesIdByGrid10[grid10] = notesId;
            potNotesId.push(_id);
        }
    }

    function BuyNote(string noteText, uint256 lat, uint256 lng, string _id, bool forSell, address referral) public payable {
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
            distributePayment(referral, grid10, notes[_id].userAddress, notes[_id].purchasePrice);
        }
        uint256 grid = getGrid(lat, lng);
        notes[_id]._id = _id;
        notes[_id].userAddress = msg.sender;
        notes[_id].note = noteText;
        notes[_id].lat = lat;
        notes[_id].lng = lng;
        notes[_id].grid = grid;
        notes[_id].grid10 = grid10;
        notes[_id].referral = referral;
        notes[_id].forSell = forSell;
        notes[_id].createdAt = now;
        lastPurchaseTime = now;
        potNotesId.push(_id);
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
            if (price > MaxPrice) {
                price = MaxPrice;
            }
        }
    }

    function getBigPrice(uint n) public returns (uint256) {
        if (PriceTable.length <= MaxPresetPricePower) {
            initPriceTable();
        }
        uint256 price = PriceTable[MaxPresetPricePower];
        uint256 tempPrice;
        for (uint256 i=0; i<n; i++) {
            tempPrice = price * ratio / 100;
            if (tempPrice < price) {
                tempPrice = price;
            }
            price = tempPrice;
        }
        if (price > MaxPrice) {
            price = MaxPrice;
        }

        return price;
    }

    function multiplyByRatio(uint256 input) public returns (uint256) {
        uint256 output = input * ratio / 100;
        return output;
    }

    function distributePayment(address referral, uint256 grid10, address seller, uint256 sellerCost) public payable {
        uint256 totalPayment = msg.value;

        //0) Seller will retain the purchasing cost and receive 75% of the profit
        if (sellerCost > 0) {
            uint256 sellerTake;
            if (totalPayment > sellerCost) {
                sellerTake = sellerCost + (totalPayment - sellerCost) * 75 / 100;
                seller.send(sellerTake);
                totalPayment -= totalPayment - sellerTake;
            } else {
                sellerTake = totalPayment;
                seller.send(totalPayment);
                return;
            }
        }
        
        //1) 55% patron bonus
        // 1.1) 20% to patrons in this grid10
        uint256 grid10TotalPatronBonus = totalPayment * 20 / 100;
        string[] notesId = notesIdByGrid10[grid10];
        uint256 grid10Len=0;
        if (notesId !=0 ) {
            grid10Len = notesId.length;
            uint256 grid10Bonus = grid10TotalPatronBonus / grid10Len;
            for (uint256 i=0; i<grid10Len; i++) {
                string _id = notesId[i];
                Note note = notes[_id];
                note.userAddress.send(grid10Bonus);
            }
        }

        // 1.2) 35% to all patrons
        uint256 allPatronBonus = totalPayment * 35 / 100;
        if (notesArray != 0) {
            uint256 arrayLen = notesArray.length;
            uint256 patronBonus = allPatronBonus / arrayLen;
            for (uint256 i=0; i<arrayLen; i++) {
                Note note = notesArray[i];
                note.userAddress.send(patronBonus);
            }
        }

        // 2) 10% last note pot
        // If during the last 24 hours (accurate to an hour), the pot reserve did not grow by 0.15%, the pot reserve will be distributed to purchasers of the last 24 hours.
        // And, the pot will be reset.
        potReserve += totalPayment * 10 / 100;
        updateHourlyPotReserves();

        // 3） 8% referral reward
        if (referral != 0) {
            uint256 referralReward = totalPayment * 8 / 100;
            referral.send(referralReward);
        }

        // 4） 20% developer team
        uint256 developerShare = totalPayment * 20 / 100;
        developerAmount += developerShare;

        //.5） 7% other fees and charity
 

    }

    function updateHourlyPotReserves() public {
        uint256 NoOf10Days = now / (10 days);
        uint256 TheHour = (now - now * NoOf10Days) / ( 1 hours);
        hourlyPotReserves[TheHour] = potReserve;
    }

    function distributePotReserve() public {
        uint256 potReserveDelta = getPotReserveDelta();
        if (potReserveDelta >= threshold && lastPurchaseTime - now > 1 days) {
            if (potReserveDelta + potReserve <= potReserve * 10015 / 10000) {
                if (potNotesId != 0) {
                    uint256 potLen = potNotesId.length;
                    uint256 perAddressReward = potReserve / potLen;
                    for (uint256 i=0; i<potLen; i++) {
                        string _id = potNotesId[i];
                        Note note = notes[_id];
                        address noteAddress = note.userAddress;
                        noteAddress.send(perAddressReward);
                    }
                    delete potNotesId;
                    delete hourlyPotReserves;
                }
            }
        }
    }

    function getPotReserveDelta() public returns (uint256) {
        uint256 NoOf10Days = now / (10 days);
        uint256 TheHour = (now - now * NoOf10Days) / ( 1 hours);
        uint256 MadHour = TheHour + 240 - 24;
        uint256 q = MadHour/240;
        uint256 PreHour = MadHour - q * 240 ;
        for (uint256 i=1; i<240; i++) {
            uint256 testHour;
            if (PreHour > i) {
                testHour = PreHour - i;
            } else {
                testHour = PreHour + 240 -i;
            }
            if (hourlyPotReserves[PreHour] != 0) {
                return potReserve - hourlyPotReserves[PreHour];
            }
        }
        return potReserve;
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
