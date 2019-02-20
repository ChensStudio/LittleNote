import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';

import { Questions,locationSchema,answersSchema } from './questions.js';


export const insertquestion = new ValidatedMethod({
    name: 'questions.insert',
    validate: new SimpleSchema({
        _id:{
          type:String,
        },
        admin:{
            type: String,
        },
        areaid: {
          type:String
        },
         latlng:{
            type: locationSchema,
        },
        'latlng.lat': {type: Number, decimal: true},
        'latlng.lng': {type: Number, decimal: true},
        noteText: {   
            type: String,
         },
        answers:{
            type:Array
        },
        // answerCost:{
        //     type:SimpleSchema.Integer
        // },
        'answers.$':{
            type:answersSchema
        },
        'answers.$.address': {type: String},
        'answers.$.content': {type: String},
        'answers.$.bonus': {type: Number, decimal:true},
        // 'answers.$.vote': {type: Number},
        startTime:{
            type:Date,
        },
        endTime:{
            type:Date,
        }
    }).validator(),
    run({_id,admin,areaid,latlng,noteText,answers,startTime,endTime}) {
        const question={
            _id:_id,
            admin: admin,
            areaid:areaid,
            latlng:latlng,
            noteText: noteText,
            answers:answers,
            // answerCost:answerCost,
            startTime:startTime,
            endTime:endTime,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        console.log(question);
        return Questions.insert(question);
    },
});

export const latestAnswer = new ValidatedMethod({
    name: 'questions.latestAnswer',
    validate: new SimpleSchema({
        questionId: {type: String},
        newAnswer: {type:answersSchema},
        'newAnswer.address':{type:String},
        'newAnswer.content':{type:String},
        'newAnswer.bonus':{type:String,decimal:true}
    }).validator({ clean: true, filter: false }),
    run({ questionId, newAnswer }) {
        const question = Questions.findOne(questionId);

        Questions.update(questionId, {
            $set: {
                updatedAt: new Date()
            },
            $push: {
                answers:newAnswer
            }
    });

  },
});

export const updateDistributeStatus = new ValidatedMethod({
    name: 'questions.updateDistributeStatus',
    validate: new SimpleSchema({
        questionId: {type: String}
    }).validator({ clean: true, filter: false }),
    run({ questionId }) {
        const question = Questions.findOne(questionId);

        Questions.update(questionId, {
            $set: {
                distributed: true
            }
    });

  },
});

export const updateWinnerBonus = new ValidatedMethod({
    name: 'questions.updateWinnerBonus',
    validate: new SimpleSchema({
        questionId: {type: String},
        address: {type: String},
        bonus:{type:Number, decimal:true}
    }).validator({ clean: true, filter: false }),
    run({questionId, address, bonus}) {
        const question = Questions.findOne(questionId);

  },
});


