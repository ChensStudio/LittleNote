import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';

import { Notes, locationSchema } from './notes.js';
import { Accounts } from '../accounts/accounts.js';

export const insert = new ValidatedMethod({
    name: 'notes.insert',
    validate: new SimpleSchema({
        _id:{
            type: String,
        },
        address:{
            type: String,
        },
        latlng:{
            type: locationSchema,
        },
        'latlng.lat': {type: Number, decimal: true},
        'latlng.lng': {type: Number, decimal: true},
        grid: {  //onchain //XXXXXYYYYY
            type: SimpleSchema.Integer,
        },
        grid10: {  //onchain //XXXXYYYY
            type: String,
        },
        noteText: {   //onchain
          type: String,
        },
        forSell:{
          type: Boolean,
        },
    }).validator(),
    run({_id,address, latlng, grid, grid10, noteText, forSell}) {
        const note={
            _id:_id,
            address: address,
            latlng: latlng,
            grid: grid,
            grid10: grid10,
            note: noteText,
            forSell: forSell,
            onChainFlag: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        return Notes.insert(note);
    },
});

export const updateAddress = new ValidatedMethod({
    name: 'notes.updateAddress',
    validate: new SimpleSchema({
        noteId: Notes.simpleSchema().schema('_id'),
        newAddress: Notes.simpleSchema().schema('address'),
    }).validator({ clean: true, filter: false }),
    run({ noteId, newAddress }) {
        const note = Notes.findOne(noteId);

        if (!note.editableBy(this.address)) {
        throw new Meteor.Error('notes.updateAddress.accessDenied',
            'You don\'t have permission to edit this note.');
        }

        // XXX the security check above is not atomic, so in theory a race condition could
        // result in exposing private data

    Notes.update(noteId, {
        $set: { 
            address: newAddress,
            updatedAt: new Date(),
        },
    });
  },
});

export const setForSell = new ValidatedMethod({
    name: 'notes.updateForSell',
    validate: new SimpleSchema({
        noteId: Notes.simpleSchema().schema('_id'),
        newForSell: Notes.simpleSchema().schema('forSell'),
    }).validator({ clean: true, filter: false }),
    run({ noteId, newForSell }) {
        const note = Notes.findOne(noteId);

        if (!note.editableBy(this.address)) {
            throw new Meteor.Error('notes.updateForSell.accessDenied',
                'You don\'t have permission to edit this note.');
        }

        // XXX the security check above is not atomic, so in theory a race condition could
        // result in exposing private data

    Notes.update(noteId, {
        $set: { 
            forSell: newForSell,
            updatedAt: new Date(),
        },
    });
  },
});

export const setOnChainFlag = new ValidatedMethod({
    name: 'notes.onChainFlag',
    validate: new SimpleSchema({
        noteId: Notes.simpleSchema().schema('_id'),
        onChainFlag: Notes.simpleSchema().schema('onChainFlag'),
    }).validator({ clean: true, filter: false }),
    run({ noteId, onChainFlag }) {
        const note = Notes.findOne(noteId);

        if (!note.editableBy(this.address)) {
            throw new Meteor.Error('notes.updateForSell.accessDenied',
                'You don\'t have permission to edit this note.');
        }

        // XXX the security check above is not atomic, so in theory a race condition could
        // result in exposing private data

    Notes.update(noteId, {
        $set: { 
            onChainFlag: onChainFlag,
            updatedAt: new Date(),
        },
    });
  },
});

// Get list of all method names on Notes
const NOTES_METHODS = _.pluck([
  insert,
  updateAddress,
  setForSell,
  setOnChainFlag,
], 'name');

if (Meteor.isServer) {
  // Only allow 5 note operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(NOTES_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}
