global.gContractAddress = '0x5215af7AB20822cFD2cD97D2A9FAa835d0B2d06A';
global.gContractAbi = [{"constant":false,"inputs":[{"name":"totalMoney","type":"uint256"},{"name":"availableMoney","type":"uint256"},{"name":"grid10","type":"uint256"}],"name":"gridPatronDistribution","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"freeFlag","type":"bool"},{"name":"newFlag","type":"bool"},{"name":"grid10","type":"uint256"},{"name":"mediaFlag","type":"bool"}],"name":"getPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MaxFreeNoteCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"SafetySendout","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"haltFlag","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"hourlyPotReservesArray","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"potNotesId","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"string"},{"name":"forSell","type":"bool"}],"name":"ToggleSell","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"totalMoney","type":"uint256"},{"name":"availableMoney","type":"uint256"}],"name":"investorDistribution","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"notesArrayByTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"investorsArray","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"string"}],"name":"getNote","outputs":[{"name":"","type":"string"},{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"bool"},{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"PriceTable","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"threshold","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"canDistributePotReserve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"lat","type":"uint256"},{"name":"lng","type":"uint256"}],"name":"getGrid10","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MaxNoteLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"founder","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MinPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"grid10","type":"uint256"}],"name":"getNotesCountByGrid10","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"potReserve","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"noteText","type":"string"},{"name":"lat","type":"uint256"},{"name":"lng","type":"uint256"},{"name":"_id","type":"string"},{"name":"forSell","type":"bool"}],"name":"EditNote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"potDistCountLimit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ratio","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"noteText","type":"string"},{"name":"lat","type":"uint256"},{"name":"lng","type":"uint256"},{"name":"_id","type":"string"},{"name":"forSell","type":"bool"},{"name":"referral","type":"address"},{"name":"mediaFlag","type":"bool"}],"name":"BuyNote","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"totalPurchase","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"grid10","type":"uint256"},{"name":"index","type":"uint256"}],"name":"getNotesIdByGrid10","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"notesArray","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"totalMoney","type":"uint256"},{"name":"availableMoney","type":"uint256"}],"name":"updatePotReserves","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"investor","type":"address"}],"name":"getInvestor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"accountsArray","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"developerAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"userName","type":"string"},{"name":"userAddress","type":"address"}],"name":"AddAccount","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"n","type":"uint256"}],"name":"getBigPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"feesAndCharity","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"totalMoney","type":"uint256"},{"name":"availableMoney","type":"uint256"}],"name":"allPatronDistribution","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"totalMoney","type":"uint256"},{"name":"availableMoney","type":"uint256"},{"name":"referral","type":"address"}],"name":"distributeReferral","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"input","type":"uint256"}],"name":"multiplyByRatio","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"distributePotReserve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MaxPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"referral","type":"address"},{"name":"grid10","type":"uint256"},{"name":"seller","type":"address"},{"name":"sellerCost","type":"uint256"}],"name":"distributePayment","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"hourNumber","type":"uint256"}],"name":"getHourlyPotReserves","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MaxUserNameLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"availableMoney","type":"uint256"}],"name":"feesAndCharityReserve","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"Invest","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"lastPurchaseTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newFounder","type":"address"}],"name":"SetFounder","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"},{"name":"to","type":"address"}],"name":"ManualTransfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"last24HourCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MaxPresetPricePower","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"halt","type":"bool"}],"name":"SetHalt","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"initPriceTable","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"name","type":"string"}],"name":"getAccountByName","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"last24HourBasisPoint","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"mediaRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"totalMoney","type":"uint256"},{"name":"availableMoney","type":"uint256"}],"name":"devTeamDistribution","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"lat","type":"uint256"},{"name":"lng","type":"uint256"}],"name":"getGrid","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"potDistBasisPointLimit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"totalMoney","type":"uint256"},{"name":"availableMoney","type":"uint256"},{"name":"sellerCost","type":"uint256"},{"name":"seller","type":"address"}],"name":"sellerDistribution","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"accountAddress","type":"address"}],"name":"getAccount","outputs":[{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"anybodyAddOtherUser","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"noteText","type":"string"},{"name":"lat","type":"uint256"},{"name":"lng","type":"uint256"},{"name":"_id","type":"string"},{"name":"forSell","type":"bool"},{"name":"referral","type":"address"},{"name":"mediaFlag","type":"bool"}],"name":"AddNote","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[{"name":"_founder","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}];
global.gContractInstance = null;

export var InitChain3 = function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof chain3 !== 'undefined') {
    console.log("chain3 is defined");
    // Use Mist/MetaMask's provider
    global.chain3js = new Chain3(chain3.currentProvider);
  } else if (typeof web3 !== 'undefined') {
    console.log("web3 is defined");
    // Use Mist/MetaMask's provider
    global.chain3js = new Chain3(web3.currentProvider);
    console.log("accounts", chain3js.mc.accounts);

    GetInstance();
    // moacSetupContract();
    // chain3js.mc.sendTransaction({
    //   from: chain3js.mc.accounts[0], 
    //   to: '0x3e14313E492cC8AF3abda318d5715D90a37Be587', 
    //   value: 1000000000000000000,
    //   data: '',
    //   gasPrice: 100000000000
    // },
    // console.log);
  } else {
    console.log('No chain3? You should consider trying MoacMask!')
    // chain3js - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    try {
      global.chain3js = new Chain3(new Chain3.providers.HttpProvider("https://gateway.moac.io/testnet"));
      moacSetupContract();
    } catch (err) {
      console.log('Error', err);
      //if pc user
      alert('Please install MOACMask wallet.\n\nFor crypto geeks who will run local nodes, you can run a local MOAC node at port 8545');
      //if mobile user

    }
  }

}

export var GetInstance = function() {
  if (!gContractInstance) {
    var MyContract = chain3js.mc.contract(gContractAbi);
    gContractInstance = MyContract.at(gContractAddress);
    return gContractInstance;
  }
  return gContractInstance;
}

var toStippedHex = function(input) {
  return chain3js.toHex(input).substr(2);
}
 
export var AddUser = function(userName, userAddress, callback) {
  var opt =  {
    from: chain3js.mc.accounts[0],
    gas: 5000000,
    value: 0,
    gasPrice: 20000000000,
  };
  gContractInstance.AddAccount.sendTransaction(
    userName,
    userAddress,
    opt,
    function (e,c) {
      console.log(e, c);
      if (callback) {
        callback(e, c);
      }
    }
  )
}

export var AddNote = function(inserts, callback) {
  var opt =  {
    from: chain3js.mc.accounts[0],
    gas: 5000000,
    value: inserts.value,
    gasPrice: 20000000000,
  };
  gContractInstance.AddNote.sendTransaction(
    inserts.noteText,
    inserts.lat,
    inserts.lng,
    inserts._id,
    inserts.forSell,
    inserts.referral,
    inserts.mediaFlag,
    opt,
    function (e,c) {
      console.log(e, c);
      if (callback) {
        callback(e, c);
      }
    }
  )
}

export var HelpAddNote = function(inserts, callback) {
  //TODO: add helper api to create notes for the user.

  var opt =  {
    from: chain3js.mc.accounts[0],
    gas: 5000000,
    value: inserts.value,
    gasPrice: 20000000000,
  };
  gContractInstance.AddNote.sendTransaction(
    inserts.noteText,
    inserts.lat,
    inserts.lng,
    inserts._id,
    inserts.forSell,
    inserts.referral,
    inserts.mediaFlag,
    opt,
    function (e,c) {
      console.log(e, c);
      if (callback) {
        callback(e, c);
      }
    }
  )
}

export var GetAccount = function(userAddress, callback) {
  return gContractInstance.getAccount(userAddress, callback);
}

export var GetNote = function(_id, callback) {
  return gContractInstance.getNote(_id, callback);
}

export var GetJackpot = function(callback) {
  return gContractInstance.potReserve(callback);
}

var sendtx = function(src, tgtaddr, amount, strData, callback) {

  chain3js.mc.sendTransaction(
    {
      from: src,
      value:chain3.toSha(amount,'mc'),
      to: tgtaddr,
      gas: "4000000",
      gasPrice: chain3.mc.gasPrice,
      data: strData
    },
    callback);
    
  console.log('sending from:' +   src + ' to:' + tgtaddr  + ' with data:' + strData);

}


