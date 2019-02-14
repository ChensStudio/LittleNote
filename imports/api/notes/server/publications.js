/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { Notes } from '../notes.js';
import { Accounts } from '../../accounts/accounts.js';

Meteor.publish('notes', function notes() {
    return Notes.find({
    }, {
        fields: Notes.publicFields,
    });
});


Meteor.publishComposite('notesWithAccountName', function notes() {
    return {
        find: function() {
            return Notes.find({}, {
                fields: Notes.publicFields,
            });
        },
        children: [{
            find: function(account) {
            // console.log("Children: Get log account.address :", account.address);
            return Accounts.find({"address": account.address}, {
                fields: Accounts.publicFields,
            });
          }
        }]
    }
});