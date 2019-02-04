import {Questions} from  '../../api/questions/questions.js';
import {Areas} from  '../../api/areas/areas.js';
import Chain3 from 'chain3';
import {contractAddr, contractAbi} from '../../api/const';

var games = Questions.find({endTime:{$gte: new Date()}});

let contractInstance = chain3.mc.contract(contractAbi).at(contractAddr);

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