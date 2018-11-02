import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';

import { Accounts } from './accounts.js';

export const accountinsert = new ValidatedMethod({
    name: 'accounts.insert',
    validate: new SimpleSchema({
        address:{
            type: String,
        },
        name:{
            type: String,
        },
    }).validator(),
    run({name, address}) {
        const account={
            name,
            address,
            noteCounts: 0,
            createdAt: new Date(),
        };

        Accounts.insert(account);
    },
});

// Get list of all method names on Notes
const ACCOUNTS_METHODS = _.pluck([
  accountinsert,
], 'name');

if (Meteor.isServer) {
  // Only allow 5 account operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(ACCOUNTS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}
