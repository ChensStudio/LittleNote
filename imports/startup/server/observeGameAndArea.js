import {Questions} from  '../../api/questions/questions.js';
import {Areas} from  '../../api/areas/areas.js';
import Chain3 from 'chain3';
import {areaGameContractAddr, areaGameContractAbi,founderAddr,founderKey} from '../../api/const';
import {newBidding, insertarea} from '../../api/areas/methods.js';
import { Random } from 'meteor/random';
import './chain3Init';

var games = Questions.find({endTime:{$gte: new Date()}});
var networkId = chain3.version.network;

let contractInstance = chain3.mc.contract(areaGameContractAbi).at(areaGameContractAddr);
var founderInfo = {
  "addr": founderAddr, 
  "key": founderKey
};

function callContractMethod(src, contractAddress, gasValue, inchainID, inByteCode,callback){
    var txcount = chain3.mc.getTransactionCount(src["addr"],"pending");
    // console.log('gasvalue',gasValue);
    console.log("Get tx count", txcount)
    //Build the raw tx obj
    //note the transaction
    var rawTx = {
      from: src.addr,
      to: contractAddress, 
      nonce: chain3.intToHex(txcount),
      gasPrice: chain3.intToHex(30000000000),
      gasLimit: chain3.intToHex(gasValue),
      value: '0x', 
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

var Area_id = Random.id(17);
var Pos_id =  Random.id(17);

console.log('position ID:',Pos_id);
console.log('area ID:',Area_id);
var bound = [{lat:66.08342,lng:26.76727},{lat:66.5125,lng:26.2381}];
var AreaInsert = {
  _id:Area_id,
  admin:founderAddr,
  bounds:bound,
  highestBidding:5,
  history:[],
  startTime:new Date(),
  endTime:new Date(new Date().getTime() + 1000*60*2)
}

var AddPosData = contractInstance.AddPosRange.getData(Pos_id,bound[0].lat,bound[0].lng,bound[1].lat,bound[1].lng);
var AddAreaData = contractInstance.AddArea.getData(Area_id, "testArea","this is test area",founderAddr,5*1e18,0.5*1e18,new Date().getTime(),new Date().getTime() + 1000*60*2);

   // let AddPosGasEstimate = chain3.mc.estimateGas({data: AddPosData});
   
   let gasEstimate = 4000000;


   callContractMethod(founderInfo,areaGameContractAddr,gasEstimate+100,networkId,AddPosData,Meteor.bindEnvironment(function(e,r){
    if(!e){
      callContractMethod(founderInfo,areaGameContractAddr,gasEstimate+100,networkId,AddAreaData,Meteor.bindEnvironment(function(e,r){
       if(!e){
        insertarea.call(AreaInsert);
      }
    }));
    }
  }));

  var checkAreaStatus = function(){
    var areas = Areas.find({endTime:{$gte: new Date()}}).fetch();
    _.each(areas, (area)=>{
      var toEnd = area.endTime - new Date();
      if (toEnd > 0) {
        console.log('bid to expired',toEnd);
      }
      else{
        console.log("area ",area," is expired");
      //write area status to chain
    }
  })
  }
  
  games.observe({
    added: function(document){
     var toExpired = Meteor.setInterval(
      ()=>{ 
       var toEnd = document.endTime - new Date();
  			// console.log('game to end', toEnd)
  			if(toEnd <= 0){
  				console.log('game',document,'expired')
  				Meteor.clearInterval(toExpired);
  			}
  		},
  		5000)
   }
 })

  Meteor.setInterval(()=>{ checkAreaStatus() },5000);


 // areas.observe({
 //  added: function(document){
 //   var toExpired = Meteor.setInterval(
 //  		()=>{ 
 //  			var toEnd = document.endTime - new Date();
 //  			console.log('areaBidding to end', toEnd)
 //  			if(toEnd <= 0){
 //  				console.log('bid',document,'expired')
 //  				Meteor.clearInterval(toExpired);
 //  				/**
 //  				Write into blockchain method
 //  				contractInstance.TriggerAreaAdmin(document._id);
 //  				*/
 //  			}
 //  		},
 //  		5000)
 //  }
 // })