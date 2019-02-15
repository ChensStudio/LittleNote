import { Mongo } from 'meteor/mongo';
import { Factory } from 'meteor/dburles:factory';
import SimpleSchema from 'simpl-schema';

class QuestionsCollection extends Mongo.Collection {
 insert(note, callback) {
   const result = super.insert(note, function(err){
    if(err){
      console.log('problem occur when call insert question');
    }
    else{
      console.log('question insert success');
    }
   });
    return result;
 }


  update(selector, modifier) {
    const result = super.update(selector, modifier);
    return result;
  }
}

export const Questions = new QuestionsCollection('questions');

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

const answersSchema = new SimpleSchema({
    address: {
      type: String
    },
    content:{
      type:String
    },
    //  vote: { 
    //   type: Number,
    // }
});

// Deny all client-side updates since we will be using methods to manage this collection
Questions.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Questions.schema = new SimpleSchema({
  _id: {    //onchain
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  admin: {    
    type: String,
  },
  areaid: {
    type:String
  },
   latlng:{
    type: locationSchema,
  },
  noteText: {   
    type: String,
  },
  answers:{
    type:Array
  },
  'answers.$':{
    type:answersSchema
  },
  startTime:{
    type:Date,
  },
  endTime:{
    type:Date,
  },
  distributed:{
    type:Boolean,
    defaultValue:false
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



Questions.attachSchema(Questions.schema);

Questions.publicFields = {
    _id:1,
    areaid:1,
    admin: 1,
    latlng:1,
    noteText:1,
    answers:1,
    endTime: 1,
    distributed:1
};



