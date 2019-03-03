import {Questions} from  '../../api/questions/questions.js';
import {Areas} from  '../../api/areas/areas.js';
import { Notes } from '../../api/notes/notes.js';
import Chain3 from 'chain3';
import { Random } from 'meteor/random';
import './chain3Init';
import {littleNoteContractAddr, littleNoteContractAbi,areaGameContractAddr,areaGameContractAbi} from '../../api/const';
import {Jackpotlogger} from "./LogInit"

let contractInstance = chain3.mc.contract(areaGameContractAbi).at(areaGameContractAddr);
let noteContractInstance = chain3.mc.contract(littleNoteContractAbi).at(littleNoteContractAddr);

//Distribute Jackpot, from 7PM every day, after 50 blocks, distribute
var filter = chain3.mc.filter("latest");
var RandomCount = -1;
var done = true;
console.log(new Date().getHours());
filter.watch(Meteor.bindEnvironment(function(e,r){
  if(!e){
     console.log(RandomCount,r);

     if(new Date().getHours() == 23 && done == true) {
        Jackpotlogger.info("Trigger countdown for distribute");
        done = false;
        RandomCount = 5;
     }
     else if (new Date().getHours() != 23 && done == false){
          Jackpotlogger.info("Close countdown until next day");
         done = true;
     }
     else if (new Date().getHours() == 23 && done == false && RandomCount != -1) {
        RandomCount --;
     }
     if (done == false && RandomCount == 0){
        let WinArray = Notes.find({}, {sort: {updatedAt: -1},limit:5}).fetch();
        if(WinArray.length < 5){
           Jackpotlogger.info("not enough paticipants");
           console.log("not enough paticipants");
        }
        else{
           Jackpotlogger.info("Distribute to:",WinArray[0].address,WinArray[1].address,WinArray[2].address,WinArray[3].address,WinArray[4].address );
           Meteor.call("DistributeJackpot",WinArray[0].address,WinArray[1].address,WinArray[2].address,WinArray[3].address,WinArray[4].address);
           // console.log(WinArray[0].address,WinArray[1].address,WinArray[2].address,WinArray[3].address,WinArray[4].address)
        }
        RandomCount--;
     }
  }
}))


var games = Questions.find({endTime:{$gte: new Date()}});
 
  var checkAreaStatus = function(){
    var areas = Areas.find({endTime:{$gte: new Date()}}).fetch();
    _.each(areas, (area)=>{
      var toEnd = area.endTime - new Date();
      if (toEnd > 5000) {
        console.log('bid to expired',toEnd);
      }
      else{
        console.log("area ",area," is expired");
        //Set activeFlag to 0
        var EndBidData = contractInstance.endBid.getData(area._id);
        callContractMethod(founderInfo,areaGameContractAddr,gasEstimate+100,0,networkId,EndBidData);
    }
  })
  }
  Meteor.setInterval(()=>{ checkAreaStatus() },5000);
  
  games.observe({
    added: function(document){
     var toExpired = Meteor.setInterval(
      ()=>{ 
       var toEnd = document.endTime - new Date();
  			console.log('game to end', toEnd)
  			if(toEnd <= 0){
  				console.log('game',document,'expired')
          var EndGameData = contractInstance.endGame.getData(document._id);
          callContractMethod(founderInfo,areaGameContractAddr,gasEstimate+100,0,networkId,EndGameData);
  				Meteor.clearInterval(toExpired);
  			}
  		},
  		5000)
   }
 })



 