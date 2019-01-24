function sendtx(src, tgtaddr, amount, strData, callback) {
    console.log('sending from:' +   src + ' to:' + tgtaddr  + ' with data:' + strData);
    chain3.mc.sendTransaction(
        {
            from: src,
            value:chain3.toSha(amount,'mc'),
            to: tgtaddr,
            gas: 9000000,
            gasPrice: chain3.mc.gasPrice,
            data: strData
        },
        callback);
        

}

var littleNoteAbi;
var littleNoteData = '';
var littleNoteAddress = '';
var littleNoteContract;
var littleNoteContractInstance;

var account1 = '';
var account2 = '';
var account3 = '';
var account4 = '';

var createNewContractFlag = false;

function loadContracts() {
    var contractName = 'LittleNote';
    loadScript(contractName + '.abi');
    loadScript(contractName + '.bin');
    littleNoteAbi = contractAbi;
    littleNoteData = contractBytecode;
    console.log("output littleNoteAbi", JSON.stringify(littleNoteAbi).substring(0, 20), '...');
    console.log("output littleNoteData", JSON.stringify(littleNoteData).substring(0, 20), '...');
}

function createLittleNoteContract(from) {
    var littleNoteContract = chain3.mc.contract(littleNoteAbi);
    var littlenote = littleNoteContract.new(
        {
            from: from, 
            data: littleNoteData, 
            gas: 9000000,
            gasPrice: chain3.mc.gasPrice*2
        }, function (e, contract){
            console.log(e, contract);
            if (typeof contract.address !== 'undefined') {
                console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
                littleNoteAddress = contract.address;
                littleNoteContract = chain3.mc.contract(littleNoteAbi);
                littleNoteContractInstance = littleNoteContract.at(littleNoteAddress);
            }
        }
    );
}

function addAccount(from, username) {
    console.log('adding account', from, username);
    littleNoteContractInstance.AddAccount.sendTransaction(
        username,
        from,
        {
            from: from,
            gas: '5000000'
        },
        function (e,c) {
            console.log(e, c);
        }
    );
}

function listAccounts() {
    var i=0;
    var started = false
    var accountAddress;
    while (!started || accountAddress.length>3) {
        started = true;
        accountAddress = littleNoteContractInstance.accountsArray(i);
        if (accountAddress.length > 3) {
            var userAccount = getAccount(accountAddress);
            console.log('user account', i, accountAddress, userAccount);
        }
        i++;
    }

    console.log('total count', i-1);
}

function getAccount(accountAddress) {
    var result = littleNoteContractInstance.getAccount.call(accountAddress);
    return result;
}

function getPrice(freeFlag, newFlag, grid10, mediaFlag) {
    littleNoteContractInstance.getPrice.call(
        freeFlag,
        newFlag,
        grid10,
        mediaFlag
    );
}

function addNote(from, username) {
    console.log('adding account', from, username);
    littleNoteContractInstance.AddAccount.sendTransaction(
        username,
        from,
        {
            from: from,
            gas: '5000000'
        },
        function (e,c) {
            console.log(e, c);
        }
    );
}

function sleepBlocks(num) {
    console.log('Sleep', num, 'blocks ...');
    admin.sleepBlocks(num);
}


function fullTest() {
    var toShaRatio = 1000000000000000000;
    account1 = mc.accounts[0];
    account2 = mc.accounts[1];
    account3 = mc.accounts[2];
    account4 = mc.accounts[3];

    console.log("===================================");
    console.log("[0] unlock accounts");
    personal.unlockAccount(account1, "test123", 0);
    personal.unlockAccount(account2, "test123", 0);
    personal.unlockAccount(account3, "test123", 0);
    personal.unlockAccount(account4, "test123", 0);

    var b1=mc.getBalance(account1)/toShaRatio;
    var b2=mc.getBalance(account2)/toShaRatio;
    var b3=mc.getBalance(account3)/toShaRatio;
    var b4=mc.getBalance(account4)/toShaRatio;

    console.log("===================================");
    console.log("[1] initial balances");
    console.log(account1, "account1", b1);
    console.log(account2, "account2", b2);
    console.log(account3, "account3", b3);
    console.log(account4, "account4", b4);

    var sendFlag = false;
    if (b2 < 220) {
        sendtx(account1, account2, 220-b2+20, "");
        sendFlag = true;
    }
    if (b3 < 200) {
        sendtx(account1, account3, 200-b3+20, "");
        sendFlag = true;
    }
    if (b4 < 600) {
        sendtx(account1, account4, 600-b4+20, "");
        sendFlag = true;
    }
    if (sendFlag) {
        sleepBlocks(1);
    }

    console.log("===================================");
    console.log("[2] send some tokens");
    console.log(account1, "account1", b1);
    console.log(account2, "account2", b2);
    console.log(account3, "account3", b3);
    console.log(account4, "account4", b4);

    loadContracts();
    console.log("===================================");
    console.log("[3] create littlenote contract");
    var createFlag = false;
    if (!littleNoteAddress || createNewContractFlag) {
        createLittleNoteContract(account2);
        createFlag = true;
    } else {
        console.log("Found existing contract at", littleNoteAddress);
        littleNoteContract = chain3.mc.contract(littleNoteAbi);
        littleNoteContractInstance = littleNoteContract.at(littleNoteAddress);
    }
    if (createFlag) {
        sleepBlocks(2);
    }

    b2 = mc.getBalance(account2)/toShaRatio;
    console.log(account2, "account2", b2);

    console.log("===================================");
    console.log("[4] get account list");
    addAccount(account2, "testuser2");
    sleepBlocks(2);
    listAccounts();

}
