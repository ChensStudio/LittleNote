import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';

import { Questions,locationSchema,answersSchema } from './questions.js';


export const insertquestion = new ValidatedMethod({
    name: 'questions.insert',
    validate: new SimpleSchema({
        _id: {
            type: String
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
        content: {
            type: String,
        },
        answers:{
            type:Array
        },
        'answers.$':{
            type:answersSchema
        },
        'answers.$.address': {type: String},
        'answers.$.content': {type: String},
        // 'answers.$.vote': {type: Number},
        startTime:{
            type:Date,
        },
        endTime:{
            type:Date,
        }
    }).validator(),
    run({admin,areaid,latlng,content,answers,startTime,endTime}) {
        const question={
            admin: admin,
            areaid:areaid,
            latlng:latlng,
            content: content,
            answers:answers,
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


