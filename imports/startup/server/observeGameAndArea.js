import {Questions} from  '../../api/questions/questions.js';
import {Areas} from  '../../api/areas/areas.js';
import Chain3 from 'chain3';
import { Random } from 'meteor/random';
import './chain3Init';

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



 