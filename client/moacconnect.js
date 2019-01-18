import {contractAddr, contractAbi, httpProvider} from '../imports/api/const';

global.gContractAddress = contractAddr; 
global.gContractAbi = contractAbi; 
global.gContractInstance = null;

export var InitChain3 = function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof chain3 !== 'undefined') {
    console.log("chain3 is defined");
    // Use Mist/MetaMask's provider
    global.chain3js = new Chain3(chain3.currentProvider);
  } else if (typeof web3 !== 'undefined') {
    // console.log("web3 is defined");
    // Use Mist/MetaMask's provider
    global.chain3js = new Chain3(web3.currentProvider);
    // console.log("accounts", chain3js.mc.accounts);

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
      global.chain3js = new Chain3(new Chain3.providers.HttpProvider(httpProvider));
      moacSetupContract();
    } catch (err) {
      console.log('Error', err);
      //if pc user
      alert('Please install MOACMask wallet.\n\nFor crypto geeks who will run local nodes, you can run a local MOAC node at port 8545');

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
  console.log('to be add',inserts);
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
      console.log('addnote',e, c);
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


