    pragma solidity ^0.4.21;
    pragma experimental ABIEncoderV2;
    //Xinle Yang
    //The full contract handling betting and rewarding.

    //TODO:
    //1) add voting part.
    //2) add possibility to do upgrade.

    contract AreaGame {
        bool public haltFlag;
        address public founder;
        address public admin;

        struct Area {
            string uid;
            uint256 activeFlag; //0: inactive; 1: active based on end time; 2: active
            string nickname;
            string description;
            address admin;

            uint256 highestBidding;
            uint256 increaseAmount;
            uint256 startTime;
            uint256 endTime;
            uint256 updatedAt;

            uint256 balance;
            string highBidId;
            string posRangeId;
        }

        struct PosRange {
            string uid;
            uint256 lat0;
            uint256 lng0;
            uint256 lat1;
            uint256 lng1;
        }

        struct Bid {
            string _id;
            string areaId;
            address bidder;
            uint256 price;
            uint256 updatedAt;
        }

        struct Game {
            string _id;
            string parentAreaId;
            string nickname;
            string description;
            uint256 balance;

            uint256 startTime;
            uint256 endTime;
            uint256 enabled;
            string question;
            string answerSet;
            address admin;
            
            uint256 proposing;
            uint256 activeFlag;
            uint256 updatedAt;
            uint256 lat;
            uint256 lng;
        }

        struct Answer {
            string _id;
            string gameid;
            address participant;
            string content;
        }

        mapping (string => Game) private games;
        mapping (string => string[]) private areaGames;
        string[] public gamesArray;

        mapping (string => string[]) private answerSet; //area id => answer array id;
        mapping (string => Answer) private answer; // answer array id => Answer object


        mapping (string => string[]) private gameNotes;

        mapping (string => string[]) private bidHistory;
        mapping (string => Bid) private bids;
        // address[] public trackRefund;

        mapping (string => Area) private areas;
        string[] public areasArray;

        mapping (string => PosRange) private posRanges;
        string[] public posRangesArray;

        mapping(string => mapping(address => bool)) hasAnswered;

        function AreaGame(address _founder) public {
            founder = _founder;
            haltFlag = false;
            admin = _founder;
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

        function SetAdmin(address newAdmin) public returns (bool) {
            if (msg.sender != founder) revert();
            admin = newAdmin;
            return true;
        }

        function AddPosRange(
            string uid,
            uint256 lat0,
            uint256 lng0,
            uint256 lat1,
            uint256 lng1) public {
            if (posRanges[uid].lat0 == 0) {
                posRanges[uid].lat0 = lat0;
                posRanges[uid].lng0 = lng0;
                posRanges[uid].lat1 = lat1;
                posRanges[uid].lng1 = lng1;
                posRangesArray.push(uid);
            }
        }

        function getPosRange(string pos_id) public view returns(uint256,uint256,uint256,uint256) {
            PosRange pos = posRanges[pos_id];
            return (pos.lat0, pos.lng0, pos.lat1,pos.lng1);
        }

        function AddGame(
            string uid, 
            string parentAreaId,
            address _admin, 
            uint256 _lat,
            uint256 _lng,
            uint256 startTime, 
            uint256 endTime, 
            string question) public {

            uint256 proposing = 0;
            uint256 enabled = 1;
            if (msg.sender != areas[parentAreaId].admin) {
                proposing = 1;
                enabled = 0;
            }

            require (games[parentAreaId].activeFlag == 0);
            
            gamesArray.push(uid);
            games[uid]._id = uid;
            games[uid].parentAreaId = parentAreaId;
            games[uid].balance += msg.value;
            games[uid].admin = _admin;
            games[uid].lat = _lat;
            games[uid].lng = _lng;
            games[uid].startTime = startTime;
            games[uid].endTime = endTime;
            games[uid].enabled = enabled;
            games[uid].question = question;
            games[uid].admin = areas[parentAreaId].admin;
            games[uid].activeFlag = 1;
            // games[uid].updatedAt = now;
        }

        function getGame(string gameid) public view returns(string,address,uint256,uint256,string,uint256){
            Game game = games[gameid];
            return (game.parentAreaId, game.admin, game.lat,game.lng, game.question,game.activeFlag);
        }

        function GetGame(string gameId) public returns (Game) {
            return games[gameId];
        }

        function addAnswer(string _gameid, string _answerid, string _content) public {

            require (games[_gameid].activeFlag == 1);
            require (!hasAnswered[_gameid][msg.sender]);
            hasAnswered[_gameid][msg.sender] = true;
            answerSet[_gameid].push(_answerid);
            answer[_answerid]._id = _answerid;
            answer[_answerid].gameid = _gameid;
            answer[_answerid].participant = msg.sender;
            answer[_answerid].content = _content;
        }

        function answersForQuestion (string _gameid) public view returns(string[]){
           return answerSet[_gameid];
        }

        function showAnswer (string _answerid) public view returns(string, string, address, string){
            Answer awr = answer[_answerid];
            return (awr._id, awr.gameid, awr.participant, awr.content);
        }

        function ifAnswered (string _gameid, address participant) public view returns (bool){
            return hasAnswered[_gameid][participant];
        }

        function endGame(string gameid) public {
            if(games[gameid].endTime < now){
                games[gameid].activeFlag = 0;
            }
        }

       function AddArea(
                string uid, 
                string nickname, 
                string description, 
                address _admin, 
                string posRangeId,
                uint256 _highestBidding, 
                uint256 _increaseAmount, 
                uint256 _startTime, 
                uint256 _endTime) public payable {

                if (msg.sender != founder && msg.sender != admin) {
                    revert();
                }

                areasArray.push(uid);
                areas[uid].uid = uid;
                areas[uid].nickname = nickname;
                areas[uid].description = description;
                areas[uid].admin = _admin;
                areas[uid].posRangeId = posRangeId;
                areas[uid].highestBidding = _highestBidding;
                areas[uid].increaseAmount = _increaseAmount;
                areas[uid].startTime = _startTime;
                areas[uid].endTime = _endTime;
                areas[uid].activeFlag = 1;
                areas[uid].balance += msg.value;
            }
        // function SetAreaPosRange(string areaId, string posRangeId) public {
        //     areas[areaId].posRangeId = posRangeId;
        // }

        function GetArea(string uid) public view returns (string,string,string,address,string,uint256,uint256,uint256,uint256,uint256,uint256 ) {
            Area area = areas[uid];
            return (area.nickname, area.description, area.admin, area.posRangeId, area.balance, area.highestBidding, area.increaseAmount,area.startTime,area.endTime,area.activeFlag);
        }

        function AddMoneyToArea(string uid) public payable {
            areas[uid].balance += msg.value;
        }

        function endBid(string areaid) public {
            if(areas[areaid].endTime < now){
                areas[areaid].activeFlag = 0;
            }
        }

         function getBidHistory(string areaid) public view returns(string[]) {
            return bidHistory[areaid];
        }

        //When you add a big, the old bids can be refunded.
        function AddBid(string _id, string areaId) public payable {
            if (areas[areaId].startTime == 0 || areas[areaId].startTime >= now || areas[areaId].endTime < now || areas[areaId].activeFlag == 0) {
                revert();
            }

            if (areas[areaId].highestBidding + areas[areaId].increaseAmount > msg.value) {
                revert();
            }

            bidHistory[areaId].push(_id);
            bids[_id]._id = _id;
            bids[_id].areaId = areaId;
            bids[_id].bidder = msg.sender;
            bids[_id].price = msg.value;
            bids[_id].updatedAt = now;
            areas[areaId].admin=msg.sender;
            areas[areaId].highestBidding = msg.value;
            areas[areaId].balance += msg.value;
            areas[areaId].highBidId = _id;
        }

        function RefundBid(string areaid,address _admin) public payable{
            require(areas[areaid].activeFlag == 1);

            if (msg.sender != founder && msg.sender != admin) {
                revert();
            }

            if (_admin != founder) {
                _admin.transfer(areas[areaid].highestBidding);
                // trackRefund.push(area.admin);
            }
        }

        function ExtendBidTime(string areaid) public{
            require(areas[areaid].activeFlag == 1);
            if (msg.sender != founder && msg.sender != admin) {
                revert();
            }
            Area area = areas[areaid];
            area.endTime = area.endTime + 60;
        }
 

        function AddGameNote(string gameId, string noteId) public {
            gameNotes[gameId].push(noteId);
        }

        function GetGameNote(string gameId, uint256 i) public returns (string) {
            return gameNotes[gameId][i];
        }

        function GetGameNoteLength(string gameId) public returns (uint256) {
            return gameNotes[gameId].length;
        }

        function ManualTransfer(uint256 amount, address to) public payable {
            if (msg.sender != founder) revert();

            to.transfer(amount);
        }

        function SafetySendout(uint256 amount) public payable {
            if (msg.sender != founder) revert();

            founder.transfer(amount);
        }
        
    }

    contract LittleNote {

        address public founder;
        address public admin;

        bool public haltFlag;
        bool public anybodyAddOtherUser;
        uint256 public MaxUserNameLength = 20;
        uint256 public MaxNoteLength = 128;
        uint256 public MaxFreeNoteCount = 1;

        uint256 public MinPrice = 5 * 10 ** 16;
        uint256 public MaxPrice = 4 * 10 ** 29;
        uint256 public ratio = 130;
        uint256 public MaxPresetPricePower = 100;

        uint256[] public PriceTable;

        uint256 public potReserve = 0;
        uint256 public feesAndCharity = 0;
        uint256 public threshold = 16384 * 10 ** 18;
        uint256 public totalPurchase = 0;
        uint256 public developerAmount = 0;
        uint256 public lastPurchaseTime;
        uint256 public potDistCountLimit = 500;
        uint256 public potDistBasisPointLimit = 50;
        uint256 public mediaRate = 10;

        //lat and lng:
        //1) both are turned into positive numbers by adding 360 to each.
        //2) both will be multiplied by 10**16
        struct Note {
            string _id;
            string parentId;
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
            bool mediaFlag;
        }

        struct Account {
            address userAddress;
            string userName;
            uint256 noteNumber;
        }


        mapping (address => Account) private accounts;
        mapping (string => uint256) private accountsByUserName;
        address[] public accountsArray;

        mapping (string => Note) private notes;
        string[] public notesArray;
        uint256[] public notesArrayByTime;
        mapping (uint256 => uint256) private notesCountByGrid10;
        mapping (uint256 => string[]) private notesIdByGrid10;
        string[] public potNotesId;

        mapping (uint256 => uint256) private hourlyPotReserves;
        uint256[] public hourlyPotReservesArray;

        mapping (address => uint256) private investors;
        address[] public investorsArray; 
        uint256 totalInvestment = 0;

        address public AreaGameAddress;
        AreaGame public AreaGameContract;

        function LittleNote(address _founder, address _areaGameAddress) public {
            founder = _founder;
            haltFlag = false;
            AreaGameAddress = _areaGameAddress;
            AreaGameContract = AreaGame(AreaGameAddress);
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

        function SetAdmin(address newAdmin) public returns (bool) {
            if (msg.sender != founder) revert();
            admin = newAdmin;
            return true;
        }

        function AddGameNote(
            string gameId, 
            string noteText, 
            uint256 lat, 
            uint256 lng, 
            string _id, 
            bool forSell, 
            address referral, 
            bool mediaFlag
            ) public payable {
            if (accounts[msg.sender].userAddress == 0 || bytes(noteText).length > MaxNoteLength || notes[_id].createdAt >= 0) {
                revert();
            }
            uint256 grid10 = getGrid10(lat, lng);
            bool freeFlag = true;
            if (notesCountByGrid10[grid10] > 0 || accounts[msg.sender].noteNumber > MaxFreeNoteCount) {
                freeFlag = false;
            }
            bool newFlag = true;
            uint256 price = getPrice(freeFlag, newFlag, grid10, mediaFlag);
            if (!freeFlag && msg.value < price) {
                revert();
            } else {
                distributePayment(referral, grid10, 0, 0);
            }
            uint256 grid = getGrid(lat, lng);
            notesArray.push(_id);
            notes[_id]._id = _id;
            notes[_id].parentId = gameId;
            notes[_id].userAddress = msg.sender;
            notes[_id].note = noteText;
            notes[_id].lat = lat;
            notes[_id].lng = lng;
            notes[_id].grid = grid;
            notes[_id].grid10 = grid10;
            notes[_id].forSell = forSell;
            notes[_id].referral = referral;
            notes[_id].mediaFlag = mediaFlag;
            notes[_id].createdAt = now;
            lastPurchaseTime = now;
            notesCountByGrid10[grid10]++;
            string[] notesId = notesIdByGrid10[grid10];
            notesId.push(_id);
            notesIdByGrid10[grid10] = notesId;
            potNotesId.push(_id);
            notesArrayByTime.push(lastPurchaseTime);

            AreaGameContract.AddGameNote(gameId, _id);
            // gameNotes[gameId].push(_id);
        }

        function DistributeForGame(string gameId, string noteId, uint256 amount) public {
            if (AreaGameContract.GetGame(gameId).balance >= amount) {
                uint len = AreaGameContract.GetGameNoteLength(gameId);
                for (uint i=0; i<len; i++) {
                    if (keccak256(AreaGameContract.GetGameNote(gameId, i)) == keccak256(noteId)) {
                        notes[noteId].userAddress.transfer(amount);
                        return;
                    }
                }
            }
        }




        function AddAccount(string userName, address userAddress) public returns (bool) {
            if (bytes(userName).length > MaxUserNameLength) {
                revert();
            }
            if (msg.sender != userAddress && (msg.sender != founder && !anybodyAddOtherUser)) {
                revert();
            }
            if (accounts[userAddress].userAddress == 0 && accountsByUserName[userName] == 0) {
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

        function Invest() public payable {
            address investor = msg.sender;
            if (investors[investor] == 0) {
                investorsArray.push(investor);
            }
            investors[investor] += msg.value;
            totalInvestment += msg.value;
            uint256 potReserveAdd = msg.value / 2;
            potReserve += potReserveAdd;
            if (msg.value > potReserveAdd) {
                feesAndCharity += msg.value - potReserveAdd;
            }
        }

        function AddNote(string noteText, uint256 lat, uint256 lng, string _id, bool forSell, address referral, bool mediaFlag) public payable {
            if (accounts[msg.sender].userAddress == 0 || bytes(noteText).length > MaxNoteLength || notes[_id].createdAt >= 0) {
                revert();
            }
            uint256 grid10 = getGrid10(lat, lng);
            bool freeFlag = true;
            if (notesCountByGrid10[grid10] > 0 || accounts[msg.sender].noteNumber > MaxFreeNoteCount) {
                freeFlag = false;
            }
            bool newFlag = true;
            uint256 price = getPrice(freeFlag, newFlag, grid10, mediaFlag);
            if (!freeFlag && msg.value < price) {
                revert();
            } else {
                distributePayment(referral, grid10, 0, 0);
            }
            uint256 grid = getGrid(lat, lng);
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
            notes[_id].mediaFlag = mediaFlag;
            notes[_id].createdAt = now;
            lastPurchaseTime = now;
            notesCountByGrid10[grid10]++;
            string[] notesId = notesIdByGrid10[grid10];
            notesId.push(_id);
            notesIdByGrid10[grid10] = notesId;
            potNotesId.push(_id);
            notesArrayByTime.push(lastPurchaseTime);
        }

        function BuyNote(string noteText, uint256 lat, uint256 lng, string _id, bool forSell, address referral, bool mediaFlag) public payable {
            if (notes[_id].createdAt == 0 || !notes[_id].forSell || accounts[msg.sender].userAddress == 0 || bytes(noteText).length > MaxNoteLength) {
                revert();
            }
            uint256 grid10 = getGrid10(lat, lng);
            bool freeFlag = true;
            if (notesCountByGrid10[grid10] > 0 || accounts[msg.sender].noteNumber > MaxFreeNoteCount) {
                freeFlag = false;
            }
            bool newFlag = false;
            uint256 price = getPrice(freeFlag, newFlag, grid10, mediaFlag);
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
            notes[_id].mediaFlag = mediaFlag;
            notes[_id].createdAt = now;
            lastPurchaseTime = now;
            potNotesId.push(_id);
            notesArrayByTime.push(lastPurchaseTime);
        }

        function ToggleSell(string _id, bool forSell) public {
            if (notes[_id].createdAt == 0) {
                revert();
            }
            Note note = notes[_id];
            if (note.userAddress != msg.sender || note.userAddress != founder) {
                revert();
            }
            note.forSell = forSell;
        }

        function EditNote(string noteText, uint256 lat, uint256 lng, string _id, bool forSell) public {
            if (msg.sender != founder || notes[_id].createdAt == 0) {
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

        function getPrice(bool freeFlag, bool newFlag, uint grid10, bool mediaFlag) public view returns (uint256) {
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

            if (mediaFlag) {
                if (price == 0) {
                    price = MinPrice;
                }
                price *= mediaRate;
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

        function getBigPrice(uint n) public view returns (uint256) {
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

        function getAccount(address accountAddress) public view returns (address, string, uint256) {
            Account account = accounts[accountAddress];
            return (account.userAddress, account.userName, account.noteNumber);
        }

        function getAccountByName(string name) public view returns (uint256) {
            return accountsByUserName[name];
        }

        function getNote(string _id) public view returns (string, address, string, uint256, uint256, uint256, uint256, bool, uint256, address, uint256) {
            Note note = notes[_id];
            return (note._id, note.userAddress, note.note, note.lat, note.lng, note.grid, note.grid10, note.forSell, note.purchasePrice, note.referral, note.createdAt);
        }

        function getNotesCountByGrid10(uint256 grid10) public view returns (uint256) {
            return notesCountByGrid10[grid10];
        }

        function getNotesIdByGrid10(uint256 grid10, uint256 index) public view returns (string) {
            return notesIdByGrid10[grid10][index];
        }

        function getHourlyPotReserves(uint256 hourNumber) public view returns (uint256) {
            return hourlyPotReserves[hourNumber];
        }

        function getInvestor(address investor) public view returns (uint256) {
            return investors[investor];
        }

        function multiplyByRatio(uint256 input) public returns (uint256) {
            uint256 output = input * ratio / 100;
            return output;
        }

        function sellerDistribution(uint256 totalMoney, uint256 availableMoney, uint256 sellerCost, address seller) public payable returns (uint256) {
            //0) Seller will retain the purchasing cost and receive 75% of the profit
            uint256 sellerTake;
            if (totalMoney > sellerCost) {
                sellerTake = sellerCost + (totalMoney - sellerCost) * 75 / 100;
            } else {
                sellerTake = totalMoney;
            }
            if (availableMoney < sellerTake) {
                sellerTake = availableMoney;
            }
            availableMoney -= sellerTake;
            seller.send(sellerTake);
            return availableMoney;
        }

        function gridPatronDistribution(uint256 totalMoney, uint256 availableMoney, uint256 grid10) public payable returns (uint256) {
            //1) 20% patron bonus
            // 1.1) 20% to patrons in this grid10
            if (notesIdByGrid10[grid10].length != 0 ) {
                uint256 grid10TotalPatronBonus = totalMoney * 20 / 100;
                uint256 grid10Len = notesIdByGrid10[grid10].length;
                uint256 grid10Bonus = grid10TotalPatronBonus / grid10Len;
                for (uint256 i=0; i<grid10Len; i++) {
                    string _id = notesIdByGrid10[grid10][i];

                    if (availableMoney < grid10Bonus) {
                        grid10Bonus = availableMoney;
                    }
                    availableMoney -= grid10Bonus;
                    if (notes[_id].userAddress != 0) {
                        notes[_id].userAddress.send(grid10Bonus);
                    }
                }
            }

            return availableMoney;
        }

        function allPatronDistribution(uint256 totalMoney, uint256 availableMoney) public payable returns (uint256) {
            // 1.2) 20% to all patrons
            if (notesArray.length != 0) {
                uint256 allPatronBonus = totalMoney * 20 / 100;
                uint256 arrayLen = notesArray.length;
                uint256 patronBonus = allPatronBonus / arrayLen;
                for (uint256 i=0; i<arrayLen; i++) {
                    // noteId = notesArray[i];
                    if (availableMoney < patronBonus) {
                        patronBonus = availableMoney;
                    }
                    availableMoney -= patronBonus;
                    notes[notesArray[i]].userAddress.send(patronBonus);
                }
            }

            return availableMoney;
        }

        function updatePotReserves(uint256 totalMoney, uint256 availableMoney) public returns (uint256) {
            // 2) 20% last note pot
            uint256 addition= totalMoney * 20 / 100;
            potReserve += addition;
            if (availableMoney > addition) {
                addition = availableMoney;
            }
            availableMoney -= addition;
            return availableMoney;
        }

        function distributeReferral(uint256 totalMoney, uint256 availableMoney, address referral) public payable returns (uint256) {
            // 3） 8% referral 
            uint256 referralReward = totalMoney * 8 / 100;
            if (availableMoney < referralReward) {
                referralReward = availableMoney;
            }
            availableMoney -= referralReward;
            referral.send(referralReward);
            return availableMoney;
        }

        function devTeamDistribution(uint256 totalMoney, uint256 availableMoney) public returns (uint256) {
            // 4） 15% developer team
            uint256 developerShare = totalMoney * 15 / 100;
            if (availableMoney < developerShare) {
                developerShare = availableMoney;
            }
            availableMoney -= developerShare;
            developerAmount += developerShare;
            return availableMoney;
        }

        function investorDistribution(uint256 totalMoney, uint256 availableMoney) public payable returns (uint256) {
            // 5） 8% investors
            if (totalInvestment == 0) {
                return availableMoney;
            }
            uint256 investorShare = totalMoney * 8 / 100;

            uint256 uintShare = investorShare / totalInvestment;
            uint256 len = investorsArray.length; 
            for (uint256 i=0; i<len; i++) {
                address investor = investorsArray[i];
                uint256 amount = investors[investor] * uintShare;
                investor.send(amount);
                if (availableMoney < amount) {
                    amount = availableMoney;
                }
                availableMoney -= amount;
            }

            return availableMoney;
        }

        function feesAndCharityReserve(uint256 availableMoney) public returns (uint256) {
            feesAndCharity += availableMoney;
            return 0;
        }

        function distributePayment(address referral, uint256 grid10, address seller, uint256 sellerCost) public payable {
            uint256 totalMoney = msg.value;
            uint256 availableMoney = totalMoney;

            //0) Seller will retain the purchasing cost and receive 75% of the profit
            availableMoney = sellerDistribution(totalMoney, availableMoney, sellerCost, seller);

            //1) 40% patron bonus
            // 1.1) 20% to patrons in this grid10
            availableMoney = gridPatronDistribution(totalMoney, availableMoney, grid10);

            // 1.2) 20% to all patrons
            availableMoney = allPatronDistribution(totalMoney, availableMoney);

            // 2) 20% last note pot
            availableMoney = updatePotReserves(totalMoney, availableMoney);

            // 3） 8% referral reward
            availableMoney = distributeReferral(totalMoney, availableMoney, referral);

            // 4） 15% developer team
            availableMoney = devTeamDistribution(totalMoney, availableMoney);

            // 5） 8% investors
            availableMoney = investorDistribution(totalMoney, availableMoney);

            // 6） 9% other fees and charity
            availableMoney = feesAndCharityReserve(availableMoney);

        }

        // function distributePotReserve() public payable {
        //     if (canDistributePotReserve()) {
        //         uint256 lastNotesCount = 5;
        //         uint256 len = notesArray.length;
        //         if (lastNotesCount > len) {
        //             lastNotesCount = len;
        //         }
        //         uint256 distributeAmount = potReserve / 2 / lastNotesCount;
        //         for (uint256 i = 0; i<lastNotesCount; i++) {
        //             string _id = notesArray[len - i - 1];
        //             address userAddress = notes[_id].userAddress;
        //             userAddress.send(distributeAmount);
        //         }
        //     }
        // }

        function last24HourCount() public view returns (uint256) {
            uint256 len = notesArrayByTime.length;
            if (len == 0) {
                return 0;
            }

            for (uint256 i = len - 1; i >= 0; i--) {
                if (notesArrayByTime[i] - now > 1 days) {
                    return len - i -1;
                }
            } 

            return len;
        }

        function last24HourBasisPoint() public view returns (uint256) {
            uint256 count = last24HourCount();
            uint256 baseCount = notesArrayByTime.length - count;
            if (baseCount == 0) {
                return 1000000;
            }
            uint256 basisPoint = count * 100 / baseCount;
            return basisPoint;
        }

        function canDistributePotReserve() public view returns (bool) {
            if (potReserve >= threshold && last24HourCount() < potDistCountLimit) {
                if (last24HourBasisPoint() < potDistBasisPointLimit) {
                    return true;
                }
            }
            return false;
        }

        function deleteHourlyPotReserves() private {
            uint256 len = hourlyPotReservesArray.length;
            for (uint256 i=0; i<len; i++) {
                delete hourlyPotReserves[hourlyPotReservesArray[i]];
            }

            delete hourlyPotReservesArray;
        }

        function ManualTransfer(uint256 amount, address to) public payable {
            if (msg.sender != founder) revert();

            to.transfer(amount);
        }

        function SafetySendout(uint256 amount) public payable {
            if (msg.sender != founder) revert();

            founder.transfer(amount);
        }

        function () public payable {
        }

        //TODO: more to add
    }