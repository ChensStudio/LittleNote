/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';

import { Notes } from '../notes.js';

Meteor.publish('notes', function notes() {
    // if (!this.address) {
    //   return this.ready();
    // }
  
    return Notes.find({
    }, {
      fields: Notes.publicFields,
    });
  });