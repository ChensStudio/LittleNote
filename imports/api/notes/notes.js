import { Mongo } from 'meteor/mongo';
import { Factory } from 'meteor/dburles:factory';
import SimpleSchema from 'simpl-schema';
import { Accounts } from '../accounts/accounts.js';
//import { TAPi18n } from 'meteor/tap:i18n';

class NotesCollection extends Mongo.Collection {
  insert(note, callback) {
      const ourNote = note;
      return super.insert(ourNote, function(err, records){
        if(!err){
          console.log('Note insert sucess');
            var count = Notes.find({"address":note.address}).count();
            Accounts.update(
                {
                    "address" : ourNote.address
                },
                {$set:
                    {
                        "noteCounts": parseInt(count)
                    }
                },
                {
                    "multi" : false,
                    "upsert" : false
                }
            );
        }
        else
        {
          console.log('Note insert err');
            return err;
        }
    });
  }

  update(selector, modifier) {
    const result = super.update(selector, modifier);
    return result;
  }

  findByBoundary(topLeft, bottomRight){
    var latMax = topLeft.latlng.lat;
    var latMin = bottomRight.latlng.lat;
    var lngMax = bottomRight.latlng.lng;
    var lngMin = topLeft.latlng.lng;
    var query;

    if(lngMax < lngMin){
        query = {
            "latlng.lat": {$gte: latMin, $lte: latMax}
            , $or: [
                {"latlng.lng": {$gte: lngMin}}
                ,{"latlng.lng": {$lte: lngMax}}
            ]
        };
    }
    else{
        query = {
            "latlng.lat": {$gte: latMin, $lte: latMax}
            ,"latlng.lng": {$gte: lngMin, $lte: lngMax}
        };
    }

    const result = super.find(query);
    return result;
  }
}

export const Notes = new NotesCollection('notes');

export const locationSchema = new SimpleSchema({
    lat: {
        type: Number,
        // required: true,
    },
    lng: {
        type: Number,
        // required: true,
    },
});

// Deny all client-side updates since we will be using methods to manage this collection
Notes.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Notes.schema = new SimpleSchema({
  _id: {    //onchain
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  address: {    //owner address onchain, index searchbyaddress, tagbyaddress
    type: String,
  },
  latlng:{    //onchain
      type: locationSchema,
  },
  grid: {  //onchain //XXXXXYYYYY
      type: SimpleSchema.Integer,
      optional: false,
  },
  grid10: {  //onchain //XXXXYYYY
      type: String,
      optional: false,
  },
  note: {   //onchain
    type: String,
    max: 128,
    optional: false,
  },
  forSell:{
    type: Boolean,
    // default: false,
  },
  onChainFlag:{
      type: Boolean,
  },
  createdAt: {  //onchain
    type: Date,
    // denyUpdate: true,
  },
  updatedAt: {  //onchain
    type: Date,
    // denyUpdate: true,
  },
});

Notes.attachSchema(Notes.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Notes.publicFields = {
    address: 1,
    latlng: 1,
    grid: 1,
    grid10: 1,
    note: 1,
    forSell: 1,
    onChainFlag: 1,
    createdAt: 1,
    updatedAt: 1,
};

Factory.define('note', Notes, {});

Notes.helpers({
  editableBy(address) {
    if (!this.address) {
      return true;
    }
    return this.address === address;
  },
});
