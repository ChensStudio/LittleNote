import './notes.js'
import {Areas} from  '../../../imports/api/areas/areas.js'
import {newBidding, insertarea} from '../../../imports/api/areas/methods.js';
import {countDownFormat} from '../../utils.js';

Meteor.subscribe('areas',function(){
      console.log('areas subscribed');
  });

Template.areainfobody.onCreated(function(){
    TemplateVar.set('areaForBidding', true);
    TemplateVar.set('ownedAsset', false);
    
});

Template.areainfobody.helpers({
	'areas'(){
		var template = Template.instance();
		var areas
		if(TemplateVar.get('areaForBidding')){
			areas = Areas.find({endTime:{$gte: new Date()}}).fetch();
		}
		else{
			areas = Areas.find({ 
				endTime:{$lt: new Date()},
				admin: chain3js.mc.accounts[0]
			},{sort: {endTime: -1}}).fetch();
		}
		
		_.each(areas,(area)=>{
			var position = {
				lat:((area.bounds[0].lat + area.bounds[1].lat)/2).toFixed(4),
				lng:((area.bounds[0].lng + area.bounds[1].lng)/2).toFixed(4)
			}
			area.position = position; 
			area.left = area.bounds[0];
			// area.right = area.bounds[1];
			 // area.time = countDownFormat(area.endTime);
			 // Meteor.setInterval(function(){ Session.set('countdown',countDownFormat(area.endTime))},1000);
		})
		return areas;
	}
})


Template.areainfobody.events({
	'click .bidding'(){
		 TemplateVar.set('areaForBidding', true);
    	 TemplateVar.set('ownedAsset', false);
	},
	'click .ownedAsset'(){
		 TemplateVar.set('areaForBidding', false);
    	 TemplateVar.set('ownedAsset', true);
	},
	'click .notecoordinates': function(e) {
    	Template.map.flyToBiddingArea(this.bounds);
    }
     	
})

Template.area.helpers({
	'forsale'(){
		return ( this.endTime - new Date() ) > 0;
	},
	'baseprice'(){
		return this.highestBidding * 1.05;
	},
	'countdown'(){
		var countdown = this._id;
		// 
		var setCountdown = Meteor.setInterval(()=>{Session.set(countdown,countDownFormat(this.endTime))},1000);
		if(Session.get(countdown) == "expired"){
			Meteor.clearInterval(setCountdown);
		}
		return Session.get(countdown);
	}
})

Template.area.events({
'click .bidbtn'(e){
	    
    	var areaid = $(e.target).data('areaid');
  		var balance =Session.get('balance');
    	// console.log('input id is',$('.bidinput')[0])
    	if(( this.endTime - new Date() ) > 0){
    		var id = `input#${areaid}`;
    		var yourbid = $(id).val();
    		// 	console.log(typeof balance);
    		// 	console.log('your balance',balance);
  			// console.log('yourbid',yourbid)
    		var confirmed = confirm("Are you sure to bid with " + yourbid+ " MOAC?");
    		if (confirmed == true){
    				if(yourbid < this.highestBidding * 1.05){
 				alert("Bid price must add 5% on base price")
 			}
 			else if (yourbid > balance){
 				alert("Not enough MOAC in your account")
 			}
 			else{
 				newBidding.call({areaId:areaid,newBidding:yourbid,bidder:chain3js.mc.accounts[0]});
 			}
    		}
    		
   		}
   		else {
   			console.log('resale');
   		} 
    	},
  'click .placegame'(e){
  	    gSetGame = true;
  	    gAreaid = this._id;
    	Template.map.flyToBiddingArea(this.bounds);
  }
})


// var bound = [{lat:63.08342,lng:25.76727},{lat:63.5125,lng:25.2381}];
//  var AreaInsert = {
//     admin:"0x4123456e7f12b0ded0f0616202434970103fcb83",
//     bounds:bound,
//     highestBidding:5,
//     history:[],
//     startTime:new Date(),
//     endTime:new Date(new Date().getTime() + 1000*60)
//   }

//   console.log('startTime',AreaInsert.startTime);
//   console.log('endTime',AreaInsert.endTime);

//   insertarea.call(AreaInsert);

 
