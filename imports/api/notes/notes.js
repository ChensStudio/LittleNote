import { Mongo } from 'meteor/mongo';
import { Factory } from 'meteor/dburles:factory';
import SimpleSchema from 'simpl-schema';
import { TAPi18n } from 'meteor/tap:i18n';

class NotesCollection extends Mongo.Collection {
  insert(note, callback) {
    const ourNote = note;
    // if (!ourNote.note) {
    //   const defaultName = TAPi18n.__('notes.insert.note', null, language);
    //   let nextLetter = 'A';
    //   ourNote.name = `${defaultName} ${nextLetter}`;
    // }
    return super.insert(ourNote, callback);
  }

  update(selector, modifier) {
    const result = super.update(selector, modifier);
    return result;
  }
}

export const Notes = new NotesCollection('notes');

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
    note: 1,
    forSell: 1,
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
