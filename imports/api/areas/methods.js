import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';

import { Areas,locationSchema,historySchema } from './areas.js';


export const insertarea = new ValidatedMethod({
    name: 'areas.insert',
    validate: new SimpleSchema({
        admin:{
            type: String,
        },
        bounds:{
            type: Array,
        },
        'bounds.$':{
            type:locationSchema
        },
        'bounds.$.lat': {type: Number, decimal: true},
        'bounds.$.lng': {type: Number, decimal: true},
        highestBidding:{
            type:Number,
        },
        history:{
            type:Array
        },
        'history.$':{
            type:historySchema
        },
        'history.$._id': {type: String},
        'history.$.bidder': {type: String},
        'history.$.updatedAt': {type: Date},
        startTime:{
            type:Date,
        },
        endTime:{
            type:Date,
        }
    }).validator(),
    run({admin,bounds,highestBidding,history,startTime,endTime}) {
        const area={
            admin: admin,
            bounds: bounds,
            highestBidding:highestBidding,
            history:history,
            startTime:startTime,
            endTime:endTime,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        console.log(area);
        return Areas.insert(area);
    },
});

export const newBidding = new ValidatedMethod({
    name: 'areas.newBidding',
    validate: new SimpleSchema({
        areaId: Areas.simpleSchema().schema('_id'),
        newBidding: Areas.simpleSchema().schema('highestBidding'),
    }).validator({ clean: true, filter: false }),
    run({ areaId, newBidding, userAddress }) {
        const area = Areas.findOne(areaId);
        var updateDate = new Date();
        // XXX the security check above is not atomic, so in theory a race condition could
        // result in exposing private data

    Areas.update(areaId, {
        $set: { 
            highestBidding: newBidding,
            updatedAt: updateDate,
        },
        $push: {
            history:{
                _id:areaId,
                bidder: userAddress,
                updatedAt:updateDate
            }
        }
       
    });
  },
});


