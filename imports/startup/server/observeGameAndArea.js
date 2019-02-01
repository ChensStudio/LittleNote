import {Questions} from  '../../api/questions/questions.js';
import {Areas} from  '../../api/areas/areas.js';
import Chain3 from 'chain3';
import {contractAddr, contractAbi} from '../../api/const';

var games = Questions.find({endTime:{$gte: new Date()}});
var areas = Areas.find({endTime:{$gte: new Date()}});
let contractInstance = chain3.mc.contract(contractAbi).at(contractAddr);
  
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

 areas.observe({
  added: function(document){
   var toExpired = Meteor.setInterval(
  		()=>{ 
  			var toEnd = document.endTime - new Date();
  			console.log('areaBidding to end', toEnd)
  			if(toEnd <= 0){
  				console.log('bid',document,'expired')
  				Meteor.clearInterval(toExpired);
  				/**
  				Write into blockchain method
  				contractInstance.TriggerAreaAdmin(document._id);
  				*/
  			}
  		},
  		5000)
  }
 })