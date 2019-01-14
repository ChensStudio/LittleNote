import { Mongo } from 'meteor/mongo';
import { Factory } from 'meteor/dburles:factory';
import SimpleSchema from 'simpl-schema';

class AreasCollection extends Mongo.Collection {
 insert(note, callback) {
   const result = super.insert(note, function(err){
    if(err){
      console.log('problem occur when call insert area');
    }
    else{
      console.log('area insert success');
    }
   });
    return result;
 }


  update(selector, modifier) {
    const result = super.update(selector, modifier);
    return result;
  }
}

export const Areas = new AreasCollection('areas');

const locationSchema = new SimpleSchema({
    lat: {
        type: Number,
        // required: true,
    },
    lng: {
        type: Number,
        // required: true,
    },
});

const historySchema = new SimpleSchema({
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    bidder: {
      type: String
    },
     updatedAt: { 
      type: Date,
    }
});


// Deny all client-side updates since we will be using methods to manage this collection
Areas.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Areas.schema = new SimpleSchema({
  _id: {    //onchain
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  admin: {    
    type: String,
  },
  bounds:{
    type: Array
  },
  'bounds.$': {
    type: locationSchema
  },
  highestBidding:{
    type:Number
  },
  history:{
    type:Array
  },
  'history.$':{
    type:historySchema
  },
  startTime:{
    type:Date,
    defaultValue:new Date()
  },
  endTime:{
    type:Date,
    defaultValue:new Date(new Date().getTime() + 1000*60*60*2)
  },
  createdAt: { 
    type: Date,
    defaultValue:new Date()
    // denyUpdate: true,
  },
  updatedAt: { 
    type: Date,
    defaultValue:new Date()
    // denyUpdate: true,
  },
});

Areas.attachSchema(Areas.schema);

Areas.publicFields = {
    admin: 1,
    // bounds: 1,
    highestBidding: 1,
    endTime: 1
};



