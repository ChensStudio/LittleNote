import './notes.js'
import {Questions} from  '../../../imports/api/questions/questions.js'
import {latestAnswer, insertquestion, updateDistributeStatus} from '../../../imports/api/questions/methods.js';
import {countDownFormat} from '../../utils.js';
import {Areas} from  '../../../imports/api/areas/areas.js';
import MoacConnect from '../../moacconnect.js';
import { Random } from 'meteor/random';



var getCountDown = function(countdown,endTime){
		if (endTime > new Date()){
		 	Meteor.setTimeout(()=>{Session.set(countdown,countDownFormat(endTime))},1000);
		 }
		 else{
		 	Session.set(countdown,"expired")
		 }
}

Meteor.subscribe('questions',function(){
      console.log('questions subscribed');
  });

Template.gamebody.onCreated(function(){
    gSetGame = false;
     $(".exiticon").css('visibility','hidden');
    Template.map.exitSetGame();
    Session.set("gAreaid","");
    
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
		getCountDown(countdown,this.endTime);
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

var distributes =[];
var distributeLimit = 5;

Template.answerModal.onCreated(function(){
	console.log('create answerModal');
	var dstbt = Questions.findOne({_id:this.data.questionId}).distributed;
	TemplateVar.set("distributeStatus",dstbt);
	var template =this;

    MoacConnect.getGameBalance(this.data.questionId,function(e,r){
		TemplateVar.set(template,"Reward",r/1e18.toFixed(3));
    });

    MoacConnect.getAnswerCost(this.data.questionId,function(e,r){
		TemplateVar.set(template,"AnswerCost",r/1e18.toFixed(3));
    });
	
	distributes =[];
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
	},
	"answered"(){
		var answered = false;
		var participants = Questions.findOne({_id:this.questionId}).answers;
		_.each(participants, (participant) => {

			if (participant.address == this.address){
				console.log('pat',participant.address,"this",this.address)
				console.log(participant.content);
				answered = true;
				this.yourAnswer = participant.content;
			}
		})
		return answered;
	},
	"admin"(){
		return Questions.findOne({_id:this.questionId}).admin;
	},
	"isadmin"(){
		var admin = Questions.findOne({_id:this.questionId}).admin;
		return admin == this.address;
	},
	"countdown"(){
		var question = Questions.findOne({_id:this.questionId});
		var countdown = question._id;
		getCountDown(countdown,question.endTime);
		return Session.get(countdown);
	}
})

Template.answerModal.events({
	'click #submitAnswer'(){
		var content = $('#answerArea').val();
		var answerId = Random.id(17);
		var questionId = this.questionId;
		var template = Template.instance();
		console.log("answerId", answerId);
        console.log("gameID", questionId);
        
		var answers = {
            questionId : questionId,
             newAnswer: {
                address:this.address,
                content: content
            }
          }

		MoacConnect.addAnswer(questionId,answerId,content,function(e,r){
			if(e){
				alert('write answer to chain error!');
			}
			else{
				// var errorMsg = Meteor.setTimeout(
    //               function(){
    //                 addAnswerEvent.stopWatching();
    //                 alert("Timeout, Please try again later")
    //               },1000*60*3);

				Session.set("loadContent","Deploying your answer to chain, please wait");
				$('div.loaderBack').show();
                var addAnswerEvent = gAreaGameContractInstance.addAnswerEvent(function(error,result){
                  if(error){
                    console.log("error on write area info to chain:",error);
                   }
                  else{
                    console.log("Answer insert with id:",result.args);
                    $('div.loaderBack').hide();
 					console.log("addAnswer");
                    latestAnswer.call(answers);
                     MoacConnect.getGameBalance(questionId,function(e,r){
					TemplateVar.set(template,"Reward",r/1e18.toFixed(3));
    				});
                    addAnswerEvent.stopWatching();
                    // Meteor.clearTimeout(errorMsg);
                    }
                });
				
			}
		})  
	},
	
	"click .distribute"(){
		var template = Template.instance();
		var winnersNum = distributes.length;
		if(winnersNum<5){
			for(let i = winnersNum; i < 5; i++){
				distributes[i] = null;
			}
		}
		var questionId = this.questionId;
		MoacConnect.distributeForGame(
		questionId,
		this.areaid,
		distributes[0],
		distributes[1],
		distributes[2],
		distributes[3],
		distributes[4],
		function(e,r){
			if(e){
				alert("error occurred when distribute reward");
			}
			else{
				console.log("distriubte for question:",questionId);
				Session.set("loadContent","Distributing Reward, please wait");
				$('div.loaderBack').show();
                var distributeForGameEvent = gAreaGameContractInstance.distributeForGameEvent(function(error,result){
                  if(error){
                    console.log("error on write area info to chain:",error);
                   }
                  else{
                    console.log("Game with id has been distributed:",result.args);
                    $('div.loaderBack').hide();
                    MoacConnect.getGameBalance(questionId,function(e,r){
					TemplateVar.set(template,"Reward",r/1e18.toFixed(3));
    				});
                    updateDistributeStatus.call({questionId:questionId});
					TemplateVar.set(template,"distributeStatus",true);
                    distributeForGameEvent.stopWatching();
                    // Meteor.clearTimeout(errorMsg);
                    }
                });
			}
		}
		);
	}
})


Template.toDistribute.onCreated(function(){
	Session.set('winners',[]);
	console.log('answer',this);
	var questionId = Template.parentData().questionId;
	
this.autorun(function(){
	TemplateVar.set("distributeStatus",
		Questions.findOne({_id:questionId}).distributed
		);
	})

})

var num = 0;
Template.toDistribute.events({
"click .prizeWinner"(e){
		TemplateVar.set("check",num++);
		if(distributes.length == 5){
			event.preventDefault();
			alert("At most 5 prize winner can be distributed");
			return;
		}

		if(e.target.checked == true) {
			distributes.push(e.target.id);
			Session.set("winners",distributes);
		}
		else {
			var idx = distributes.indexOf(e.target.id);
			distributes.splice(idx,1);
			Session.set("winners",distributes);
		}

		console.log(distributes);

		// console.log(e.target.checked,e.target.id);
	}
})

Template.toDistribute.helpers({
	
	'distributeRate'(){
		let dstbt = Session.get("winners");
		var answer = Template.instance().data;
		var address = answer.address;
		var idx = dstbt.indexOf(address);
		var rate = 50;
		if(idx == -1 || TemplateVar.get("distributeStatus")){
			return;
		}
		return "<div style='margin-left: 29px;color:#0CCA07;font-size: 12px'>Distribute <span style='color:red;font-weight:bolder;'>" 
		+ rate/(Math.pow(2,idx)).toString() 
		+ "%</span> of total reward to this answer</div>";
	}
	
})