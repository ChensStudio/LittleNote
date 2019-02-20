/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { Areas } from '../areas.js';

Meteor.publish('areas', function areas() {
	// check(highestBidding, Number);
	
    return Areas.find({
    }, {
        fields: Areas.publicFields,
    });
});