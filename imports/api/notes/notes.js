import { Mongo } from 'meteor/mongo';
import { Factory } from 'meteor/dburles:factory';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

class NotesCollection extends Mongo.Collection {
  insert(note, callback, language = 'en') {
    const ourNote = note;
    if (!ourNote.note) {
      const defaultName = TAPi18n.__('notes.insert.list', null, language);
      let nextLetter = 'A';
      ourNote.name = `${defaultName} ${nextLetter}`;
    }
    return super.insert(ourNote, callback);
  }

  update(selector, modifier) {
    const result = super.update(selector, modifier);
    return result;
  }
}

export const Notes = new NotesCollection('notes');

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
  address: {    //owner address onchain
    type: String,
    denyUpdate: true,
  },
  location:{    //onchain
      latitude: {
          type: Number
      },
      longtitude: {
          type: Number
      }
  },
  grid: {  //onchain //XXXXXYYYYY
      type: Number
  },
  note: {   //onchain
    type: String,
    max: 128,
    optional: false,
  },
  forSell:{
    type: Boolean,
    default: false,
  },
  createdAt: {  //onchain
    type: Date,
    denyUpdate: true,
  },
  updatededAt: {  //onchain
    type: Date,
    denyUpdate: true,
  },
});

Notes.attachSchema(Notes.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Notes.publicFields = {
    address: 1,
    location: 1,
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
