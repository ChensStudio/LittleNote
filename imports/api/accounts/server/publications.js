/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { Accounts } from '../accounts.js';

Meteor.publish('accounts', function accounts() {
    return Accounts.find({
    }, {
        fields: Accounts.publicFields,
    });
});