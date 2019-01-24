import './notes.js'
import {Questions} from  '../../../imports/api/questions/questions.js'
import {latestAnswer, insertquestion} from '../../../imports/api/questions/methods.js';
import {countDownFormat} from '../../utils.js';
import {Areas} from  '../../../imports/api/areas/areas.js'

Meteor.subscribe('questions',function(){
      console.log('questions subscribed');
  });

Template.gamebody.onCreated(function(){
    gSetGame = false;
    
});

Template.gamebody.helpers({
	'games'(){
		var games = Questions.find({endTime:{$gte: new Date()}},{sort: {endTime: -1}}).fetch();
		return games;
	}
})

Template.game.helpers({
	'countdown'(){
		var countdown = this._id;
		// 
		var setCountdown = Meteor.setInterval(()=>{Session.set(countdown,countDownFormat(this.endTime))},1000);
		if(Session.get(countdown) == "expired"){
			Meteor.clearInterval(setCountdown);
		}
		return Session.get(countdown);
	},
	'coordinate'(){
		return this.latlng.lat.toFixed(4) + ", " + this.latlng.lng.toFixed(4);
	}
})

Template.game.events({
	'click .joinbtn'(){
		var areaid = this.areaid;
		console.log("areaid",areaid);
		var area = Areas.findOne({_id: areaid});
		Template.map.flyToBiddingArea(area.bounds);
		Template.map.joinGame(this.latlng.lat,this.latlng.lng);

	}
})

Template.answerModal.onCreated(function(){
	console.log(this);
})


Template.answerModal.helpers({
	'totalAnswers'(){
		return Questions.findOne({_id:this.questionId}).answers.length;
	},
	'expired'(){
		return Questions.findOne({_id:this.questionId}).endTime < new Date();
	},
	'answers'(){
		return Questions.findOne({_id:this.questionId}).answers;
	}
})

Template.answerModal.events({
	'click #submitAnswer'(){
		var content = $('#answerArea').val();

		var answers = {
            questionId : this.questionId,
             newAnswer: {
                address:this.address,
                content: content
            }
          }
          latestAnswer.call(answers);
	}
})