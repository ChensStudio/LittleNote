/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { Questions } from '../questions.js';

Meteor.publish('questions', function() {
	
    return Questions.find({
    }, {
        fields: Questions.publicFields,
    });
});