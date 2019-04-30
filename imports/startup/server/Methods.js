import {littleNoteContractAddr, littleNoteContractAbi, areaGameContractAddr,areaGameContractAbi,founderAddr,founderKey} from '../../api/const';
import {newBidding, insertarea} from '../../api/areas/methods.js';
import './chain3Init';

var networkId = chain3.version.network;
let contractInstance = chain3.mc.contract(areaGameContractAbi).at(areaGameContractAddr);
let noteContractInstance = chain3.mc.contract(littleNoteContractAbi).at(littleNoteContractAddr);
var founderInfo = {
  "addr": founderAddr, 
  "key": founderKey
};
var gasEstimate = 4000000;

var bounds = [{lat:29.59536556558809,lng:121.15456581115724},{lat:30.438037173124464,lng:122.02797889709474}];
var AreaInsert = {
  _id:"Area_id",
  admin:"0x2cb3f047211d7b6c63c8ce51d1ffe7d4a34ff143",
  bounds:bounds,
  nickname:"上海",
  description:"2018年，全年上海口岸货物进出口总额85317.0亿元，比上年增长7.7%。其中，进口36403.1亿元，增长8.8%;出口48913.9亿元，增长6.9%。全年上海关区货物进出口总额64064.29亿元，比上年增长7.3%。其中，进口26965.19亿元，增长9.2%;出口37099.10亿元，增长6.0%。",
  highestBidding:2.5,
  history:[],
  startTime:new Date(),
  endTime:new Date(new Date().getTime() + 1000*60*60*36)
}

function callContractMethod(src, contractAddress, gasValue, MsgValue,inchainID, inByteCode,callback){
    var txcount = chain3.mc.getTransactionCount(src["addr"],"pending");
    // console.log('gasvalue',gasValue);
    console.log("Get nonce", txcount)
    //Build the raw tx obj
    //note the transaction
    var rawTx = {
      from: src.addr,
      to: contractAddress, 
      nonce: chain3.intToHex(txcount),
      gasPrice: chain3.intToHex(30000000000),
      gasLimit: chain3.intToHex(gasValue),
      value: chain3.intToHex(MsgValue), 
      data: inByteCode,
      chainId: chain3.intToHex(inchainID)
    }
    // console.log(rawTx);
    var cmd1 = chain3.signTransaction(rawTx, src["key"]);    

    console.log("\nSend signed TX:\n", cmd1);

    chain3.mc.sendRawTransaction(cmd1, function(err, hash) {
     if (err){
      console.log('chain3 err:',err.message);
      return;
    }
    if(callback){
      callback(err,hash);
    }
    })
  }


 Meteor.methods({
  	RefundBid(areaid,admin){
  			var RefundBidData = contractInstance.RefundBid.getData(areaid,admin);
  			callContractMethod(founderInfo,areaGameContractAddr,gasEstimate+100,0,networkId,RefundBidData);
  	},
    ExtendBidTime(areaid){
        var ExtendBidTimeData = contractInstance.ExtendBidTime.getData(areaid);
        callContractMethod(founderInfo,areaGameContractAddr,gasEstimate+100,0,networkId,ExtendBidTimeData);
    },
    AdminAddArea(AreaInsert){
      console.log(AreaInsert);
       let Area_id = Random.id(17);
       let Pos_id =  Random.id(17);
       console.log('position ID:',Pos_id);
       console.log('area ID:',Area_id);
       AreaInsert._id = Area_id;
     
       console.log(AreaInsert);
       let AddPosData = contractInstance.AddPosRange.getData(Pos_id,AreaInsert.bounds[0].lat*1e15 + 360*1e15,AreaInsert.bounds[0].lng*1e15 + 360*1e15,AreaInsert.bounds[1].lat*1e15 + 360*1e15,AreaInsert.bounds[1].lng*1e15 + 360*1e15);
       let AddAreaData = contractInstance.AddArea.getData(AreaInsert._id, AreaInsert.nickname,AreaInsert.description,founderAddr,Pos_id,AreaInsert.highestBidding*1e18,5*1e17,Math.round(AreaInsert.startTime.getTime()/1000), Math.round(AreaInsert.endTime.getTime()/1000));
       callContractMethod(founderInfo,areaGameContractAddr,gasEstimate+100,0,networkId,AddPosData);
       Meteor.setTimeout(
        function(){
          callContractMethod(founderInfo,areaGameContractAddr,gasEstimate+100,10,networkId,AddAreaData,Meteor.bindEnvironment(function(e,r){
            if(!e){
                console.log("TransactionHash ",r);
                // chain3.mc.getTransaction(r,function(e,r){
                //         console.log('transaction index',r.transactionIndex);
                //  })  
                var AddAreaEvent = contractInstance.AddAreaEvent(Meteor.bindEnvironment(function(error,result){
                  if(error){
                    console.log("error on write area info to chain:",error);
                  }
                  else{
                    // console.log(AddAreaEvent);
                    console.log("area insert with id:",result.args);
                    insertarea.call(AreaInsert);
                    AddAreaEvent.stopWatching();
                  }
                 }))
                }
              }))
         },10000);
      },
      EndGame(game_id){
        var EndGameData = contractInstance.endGame.getData(game_id);
        callContractMethod(founderInfo,areaGameContractAddr,gasEstimate+100,0,networkId,EndGameData);
      },
      EndBid(area_id){
        var EndBidData = contractInstance.endBid.getData(area_id);
        callContractMethod(founderInfo,areaGameContractAddr,gasEstimate+100,0,networkId,EndBidData);
      },
      DistributeJackpot(win1,win2,win3,win4,win5){
        var PotRewardDistributionData = noteContractInstance.PotRewardDistribution.getData(win1,win2,win3,win4,win5);
        callContractMethod(founderInfo,littleNoteContractAddr,gasEstimate+100,0,networkId,PotRewardDistributionData);
      }
  })

    // if(bounds[0].lat < bounds[1].lat && bounds[0].lng < bounds[1].lng){
    //     Meteor.apply("AdminAddArea",[AreaInsert]);
    // }
    // else {
    //   console.log("incorrect area cooridinate format");
    // }
    //     