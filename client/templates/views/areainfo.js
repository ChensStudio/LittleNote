import './notes.js'
import {Areas} from  '../../../imports/api/areas/areas.js'
import {newBidding, insertarea} from '../../../imports/api/areas/methods.js';
import {countDownFormat} from '../../utils.js';
import MoacConnect from '../../moacconnect.js';
import { Random } from 'meteor/random';

Meteor.subscribe('areas',function(){
      console.log('areas subscribed');
  });

Template.areainfobody.onCreated(function(){
    TemplateVar.set('areaForBidding', true);
    TemplateVar.set('ownedAsset', false);

});

Template.areainfobody.onRendered(function(){

Tracker.autorun(function () {
      console.log(Session.get('gUserAddress'));
  	  //  Blaze.remove(); // this will remove the current template.
	  // Blaze.render(this); // rerender
   });
    
});

Template.areainfobody.helpers({
	'areas'(){
		var template = Template.instance();
		var areas;
		if(TemplateVar.get('areaForBidding')){
			areas = Areas.find({endTime:{$gte: new Date()}}).fetch();
		}
		else{
			areas = Areas.find({ 
				endTime:{$lt: new Date()},
				admin: Session.get('gUserAddress')
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
		return this.highestBidding + 0.5;
	},
	'countdown'(){
		var countdown = this._id;
		// 
		// var setCountdown = Meteor.setInterval(()=>{Session.set(countdown,countDownFormat(this.endTime))},1000);
		// if(Session.get(countdown) == "expired"){
		// 	Meteor.clearInterval(setCountdown);
		// }
		 if (this.endTime > new Date()){
		 	Meteor.setTimeout(()=>{Session.set(countdown,countDownFormat(this.endTime))},1000);
		 }
		 else{
		 	Session.set(countdown,"expired")
		 }

		return Session.get(countdown);
	},
	"setGame"(){
	    let gAreaid = Session.get("gAreaid");
		// console.log(this._id, "g_id:",gAreaid);
		return this._id == gAreaid;
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
    				if(yourbid < this.highestBidding + 0.5){
 				alert("Bid price must add 0.5MOAC on base price")
 			}
 			else if (yourbid > balance){
 				alert("Not enough MOAC in your account")
 			}
 			else{
 				var bid_id = Random.id(17);
 				console.log('bid_id',bid_id);
 				var currentAdmin = this.admin;
 				console.log('currentAdmin',currentAdmin);
 				MoacConnect.AddBid(bid_id, areaid,yourbid,function(e,r){
 					if(e){
 						console.log("bid error");
 						return;
 					}
 					else{
 					Meteor.call("RefundBid",areaid,currentAdmin);
 					newBidding.call({areaId:areaid,bidId:bid_id,newBidding:yourbid,bidder:chain3js.mc.accounts[0]});

 					}
 				})
 				
 			}
    		}
    		
   		}
   		else {
   			console.log('resale');
   		} 
    	},
  'click #placegame'(e){
  	    gSetGame = true;
  	    Session.set("gAreaid",this._id);
  	    Template.map.flyToBiddingArea(this.bounds);
  	    // $(".exiticon").css('visibility','visible');
  },
  'click #cancel'(e){
  	 gSetGame = false;
     // $(".exiticon").css('visibility','hidden');
     Template.map.exitSetGame();
     Session.set("gAreaid","");
  }
})


// Tracker.autorun(function () {
      
//       console.log(gAreaid)
//    });



