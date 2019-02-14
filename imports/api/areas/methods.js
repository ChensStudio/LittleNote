import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';

import { Areas,locationSchema,historySchema } from './areas.js';


export const insertarea = new ValidatedMethod({
    name: 'areas.insert',
    validate: new SimpleSchema({
        _id: {    //onchain
            type: String,
            },
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
        'history.$.price': {type: Number},
        'history.$.updatedAt': {type: Date},
        startTime:{
            type:Date,
        },
        endTime:{
            type:Date,
        }
    }).validator(),
    run({_id,admin,bounds,highestBidding,history,startTime,endTime}) {
        const area={
            _id:_id,
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
        console.log('server time',new Date())
        return Areas.insert(area);
    },
});

export const newBidding = new ValidatedMethod({
    name: 'areas.newBidding',
    validate: new SimpleSchema({
        areaId: Areas.simpleSchema().schema('_id'),
        newBidding: Areas.simpleSchema().schema('highestBidding'),
        bidder:Areas.simpleSchema().schema('admin'),
    }).validator({ clean: true, filter: false }),
    run({ areaId, bidId, newBidding, bidder }) {
        const area = Areas.findOne(areaId);
        var updateDate = new Date();
        if(area.endTime - new Date() < 1000*60) {
            console.log('extend bidding time');
            console.log(area.endTime);
            
            Areas.update(areaId,
                {
                    $set:{
                        endTime: new Date(area.endTime.getTime() + 1000*60)
                    }
                });
            
             Meteor.call("ExtendBidTime",area._id);
        }

            
         Areas.update(areaId, {
            $set: { 
                admin:bidder,
                highestBidding: newBidding,
                updatedAt: updateDate,
                },
            $push: {
                 history:{
                        _id:bidId,
                        bidder: bidder,
                        price:newBidding,
                        updatedAt:updateDate
                     }
                 }
       
        });
  },
});


