import {Notes} from '../imports/api/notes/notes.js';

Meteor.subscribe('notes');
Meteor.subscribe('accounts');

var ONE_MINUTE = 60 * 1000;
var ONE_HOUR = 60 * ONE_MINUTE;
var ONE_DAY = 24 * ONE_HOUR;
var ONE_WEEK = 7 * ONE_DAY;
var DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var MONTHS = ['Jan.','Feb.','Mar.','Apr.','May','June','July','Aug.','Sep.','Oct.','Nov.','Dec.'];

export const dateFormat = function(d) {
    var then = new Date(d);
    var now = Date.now();
    var diff = now - d;
    var display;
    var seconds = Math.floor(diff/1000);
    var minutes;
    var hours;
    var day;
    var month;
    var year;
    var date;

    if (diff < ONE_MINUTE) {
        display = seconds + 's ago'
    } else if (diff < ONE_HOUR) {
        minutes = Math.floor(seconds/60);
        seconds -= minutes * 60;
        display = minutes + 'm' + seconds + 's ago';
    } else if (diff < ONE_DAY) {
        hours = Math.floor(seconds/3600);
        minutes = Math.floor((seconds - hours * 3600) / 60);
        seconds -= minutes * 60 + hours * 3600;
        // display = hours + 'hours' + minutes + 'm' + seconds + 's ago';
        display = hours + ' hours ago';
    } else if (diff < ONE_WEEK) {
        day = DAYS[ then.getDay() ];
        display = day;
    } else {
        date = then.getDate();
        month = MONTHS[ then.getMonth() ];
        year = then.getYear();
        display = month + ' ' + date + ', ' + year;
    }
    return display;
}

export const getPrice = function(grid10, selfFlag, freeFlag) {
    var count = Notes.find({"grid10": grid10}).count();
    // console.log("getPrice count", count, "grid10", grid10);

    if (selfFlag) {
        if (count == 0) {
            count++;
        }
    } else {
        if (count == 0) {
            if (freeFlag) {
                return 'FREE';
            } else {
                return 0;
            }
        } else {
            count++;
        }
    }

    var price = Math.floor(0.05 * Math.pow(1.35, count-1) * 100 + 0.5)/100;
    return price;
}

var limitLng = function(lng) {
    while (lng > 180) {
        lng -= 360;
    }
    while (lng < -180) {
        lng += 360;
    }
    return lng;
}

var limitLat = function(lat) {
    while (lat > 90) {
        lat -= 180;
    }
    while (lat < -90) {
        lat += 180;
    }
    return lat;
}

export const getGrid = function(latlng) {
    var lat = limitLat(latlng.lat);
    var lng = limitLng(latlng.lng);
    var latGrid = Math.floor((lat + 360) * 100) + '';
    var lngGrid = Math.floor((lng + 360) * 100) + '';
    return latGrid + lngGrid;
}

export const getGrid10 = function(latlng) {
    var lat = limitLat(latlng.lat);
    var lng = limitLng(latlng.lng);
    var latGrid = Math.floor((lat + 360) * 10) + '';
    var lngGrid = Math.floor((lng + 360) * 10) + '';
    return latGrid + lngGrid;
}
