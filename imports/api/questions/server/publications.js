/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { Questions } from '../questions.js';

Meteor.publish('quesitons', function() {
	
    return Quesitons.find({
    }, {
        fields: Quesitons.publicFields,
    });
});