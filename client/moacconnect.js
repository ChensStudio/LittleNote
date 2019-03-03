import {littleNoteContractAddr, littleNoteContractAbi, areaGameContractAddr,areaGameContractAbi,httpProvider} from '../imports/api/const';

global.gContractAddress = littleNoteContractAddr; 
global.gContractAbi = littleNoteContractAbi; 
global.gContractInstance = null;

global.gAreaGameContractAddress = areaGameContractAddr; 
global.gAreaGameContractAbi = areaGameContractAbi; 
global.gAreaGameContractInstance = null;

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
    GetAreaGameInstance();
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

export var GetAreaGameInstance = function() {
  if (!gAreaGameContractInstance) {
    var MyContract = chain3js.mc.contract(gAreaGameContractAbi);
    gAreaGameContractInstance = MyContract.at(gAreaGameContractAddress);
    return gAreaGameContractInstance;
  }
  return gAreaGameContractInstance;
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
  console.log('insert value is',inserts.value);
  var opt =  {
    from: chain3js.mc.accounts[0],
    gas: 5000000,
    value: inserts.value*1e18,
    gasPrice: 20000000000,
  };
  gContractInstance.AddNote.sendTransaction(
    inserts.areaid,
    inserts.noteText,
    inserts.lat*1e15 + 360*1e15,
    inserts.lng*1e15 + 360*1e15,
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

export var AddBid = function(_id, _areaId, yourbid,callback){
  console.log("bid price:",yourbid);
  console.log("area id:",_areaId);
  var opt = {
    from: chain3js.mc.accounts[0],
    gas: 5000000,
    value: yourbid*1e18,
    gasPrice: 20000000000,
  }

  gAreaGameContractInstance.AddBid.sendTransaction(
      _id, 
      _areaId,
      opt,
      function (e,c) {
      console.log('add bid',e, c);
      if (callback) {
        callback(e, c);
      }
    }
  )
}

export var AddGame = function(_id, _areaId, admin, lat,lng, startTime, endTime, question,answerCost,callback){
  var opt = {
    from: chain3js.mc.accounts[0],
    gas: 5000000,
    gasPrice: 20000000000,
  }

  gAreaGameContractInstance.AddGame.sendTransaction(
      _id, 
      _areaId,
      admin,
      lat*1e15,
      lng*1e15,
      startTime,
      endTime,
      question,
      answerCost,
      opt,
      function (e,c) {
      console.log('Add Game',e, c);
      if (callback) {
        callback(e, c);
      }
    }
  )
}

export var addAnswer = function(_gameid, _answerid, content,callback){
  
  getAnswerCost(_gameid,function(e,cost){
      if(!e){
        var opt = {
        from: chain3js.mc.accounts[0],
        value:cost,
        gas: 5000000,
        gasPrice: 20000000000,
      }

      gAreaGameContractInstance.addAnswer.sendTransaction(
        _gameid, 
        _answerid,
        content,
        opt,
        function (e,c) {
        console.log('Add Answer',e, c);
        if (callback) {
          callback(e, c);
          }
        }
        )
      }
  })
}

export var distributeForGame = function(_gameid,_areaId,winner1,winner2,winner3,winner4,winner5,callback){
    var opt = {
      from: chain3js.mc.accounts[0],
      gas: 5000000,
      gasPrice: 20000000000,  
    }
    gAreaGameContractInstance.distributeForGame.sendTransaction(
      _gameid,
      _areaId,
      winner1,
      winner2,
      winner3,
      winner4,
      winner5,
      opt,
      function (e,c) {
      console.log('Distribute Reward',e, c);
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

export var getGameBalance = function(_gameId,callback) {
  return gAreaGameContractInstance.getGameBalance(_gameId,callback);
}

export var getAnswerCost = function(_gameId,callback) {
  return gAreaGameContractInstance.getAnswerCost(_gameId,callback);
}

export var getAreaBalance = function(_areaId,callback) {
  return gAreaGameContractInstance.getAreaBalance(_areaId,callback);
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


