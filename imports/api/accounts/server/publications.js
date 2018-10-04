/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { Accounts } from '../accounts.js';

Meteor.publish('accounts', function accounts() {
    if (!this.address) {
      return this.ready();
    }
  
    return Accounts.find({
        address: this.address,
    }, {
      fields: Accounts.publicFields,
    });
  });