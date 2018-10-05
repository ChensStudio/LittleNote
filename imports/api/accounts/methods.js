import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';

import { Accounts } from './accounts.js';

export const insert = new ValidatedMethod({
    name: 'accounts.insert',
    validate: Accounts.simpleSchema().pick([name, address]).validator({clean: true, filter: false}),
    run({name, address}) {
        const account={
            name,
            address,
            createdAt: new Date(),
        };

        Accounts.insert(account);
    },
});

// Get list of all method names on Notes
const ACCOUNTS_METHODS = _.pluck([
  insert,
], 'name');

if (Meteor.isServer) {
  // Only allow 5 list operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(ACCOUNTS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}
