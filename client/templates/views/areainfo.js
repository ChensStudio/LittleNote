import './notes.js'
import {Areas} from  '../../../imports/api/areas/areas.js'
import {newBidding, insertarea} from '../../../imports/api/areas/methods.js';
import {countDownFormat} from '../../utils.js';

Meteor.subscribe('areas',function(){
      console.log('areas subscribed');
  });

Template.areainfobody.onCreated(function(){
    var template = Template.instance();
    TemplateVar.set('areaForBidding', true);
    TemplateVar.set('ownedAsset', false);
    
});

Template.areainfobody.helpers({
	'areas'(){
		var areas
		if(TemplateVar.get('areaForBidding')){
			areas = Areas.find({endTime:{$gte: new Date()}}).fetch();
		}
		else{
			areas = Areas.find({ 
				endTime:{$lt: new Date()},
				admin: chain3js.mc.accounts[0]
			}).fetch();
		}
		
		_.each(areas,(area)=>{
			var position = {
				lat:((area.bounds[0].lat + area.bounds[1].lat)/2).toFixed(4),
				lng:((area.bounds[0].lng + area.bounds[1].lng)/2).toFixed(4)
			}
			area.position = position; 
			 area.time = countDownFormat(area.endTime);
			// Meteor.setInterval(function(){area.time += 1; console.log(area.time)},1000);
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
        var lat = parseFloat($(e.target).data('lat'));
        var lng = parseFloat($(e.target).data('lng'));
    	Template.map.flyToBiddingArea(lat, lng);

    }
})

Template.area.helpers({
	'forsale'(){
		return ( this.endTime - new Date() ) > 0;
	}
})


// var bound = [{lat:45.712,lng:-74.227},{lat:45.774,lng:74.125}];
//  var AreaInsert = {
//     admin:"0x4657ec6e7f12b0ded0f0616202434970103fcb83",
//     bounds:bound,
//     highestBidding:5,
//     history:[],
//     startTime:new Date(),
//     endTime:new Date(new Date().getTime() + 1000*60*60)
//   }

//   insertarea.call(AreaInsert);

 // newBidding.call({areaId:'m29qd2nHuXSpwrPti',newBidding:10,bidder:'0x9957ec6E7F12b0dED0F0616202434970103FcB83'});
