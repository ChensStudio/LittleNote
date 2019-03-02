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
        display = seconds + TAPi18n.__("time.sec") + ' ' + TAPi18n.__("time.ago");
    } else if (diff < ONE_HOUR) {
        minutes = Math.floor(seconds/60);
        seconds -= minutes * 60;
        display = minutes + TAPi18n.__("time.min") + ' ' + seconds + TAPi18n.__("time.sec") + ' ' + TAPi18n.__("time.ago");
    } else if (diff < ONE_DAY) {
        hours = Math.floor(seconds/3600);
        minutes = Math.floor((seconds - hours * 3600) / 60);
        seconds -= minutes * 60 + hours * 3600;
        // display = hours + 'hours' + minutes + 'm' + seconds + 's ago';
        display = hours + TAPi18n.__("time.hour") + ' ' + TAPi18n.__("time.ago");
    } else if (diff < ONE_WEEK) {
        day = DAYS[ then.getDay() ];
        display = day;
    } else {
        date = then.getDate();
        month = MONTHS[ then.getMonth() ];
        year = 1900 + then.getYear();
        display = month + ' ' + date + ', ' + year;
    }
    return display;
}

export const countDownFormat = function(end){
    var now = new Date();
    var diff = end - now;
    if(diff <= 0){
        return "expired";
    }
    var sec = Math.floor(diff/1000);
    var hr = Math.floor(sec/3600);
    if(hr < 10){hr = "0" + hr}
    var min = Math.floor((sec-hr*3600)/60);
    if(min < 10){min = "0" + min}
    var sec = sec%60;
    if(sec < 10){sec = "0" + sec}
    var formated = hr + " : " + min + " : " + sec;
    return formated;

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

export const getLatLng4 = function(latlng) {
  var lat4 = Math.floor(latlng.lat * 10000 + 0.5) / 10000;
  var lng4 = Math.floor(latlng.lng * 10000 + 0.5) / 10000;

  return {lat: lat4, lng: lng4};
}


export const displayCoordinates = function(latlng) {
  console.log('latlng', latlng);

  var latAbs = Math.abs(latlng.lat.toFixed(4));
  var lngAbs = Math.abs(latlng.lng.toFixed(4));

  var lat = latlng.lat > 0 ? latAbs + ' N' : latAbs + ' S';
  var lng = latlng.lng > 0 ? lngAbs + ' E' : lngAbs + ' W';
  return lat + ', ' + lng;
}


export const openedArea = function(bounds){

    let lu = [bounds[0].lng,bounds[0].lat];
    let ru = [bounds[0].lng,bounds[1].lat];
    let rd = [bounds[1].lng,bounds[1].lat];
    let ld = [bounds[1].lng,bounds[0].lat];
       
    return [lu,ru,rd,ld];
}

export var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>Area Information</h4>' +  ( (props&&!Session.get("AreaElement")) ?

        '<div class="AreaInfoContent">ADMIN: ' +props.admin + '<br />REGION: ' + props.nickname + '<br />DESCRIPTION: ' + props.description +'</div>'
        : 'Hover over a area');
};

export const highlightFeature = function(e) {
    var layer = e.target;

    layer.setStyle({
        weight:2,
        color:"black",
        fillOpacity:0,
        opacity:0.5
    });
    Session.set("AreaAdmin",layer.feature.properties.admin);   
    Session.set("gUncharted",false);
    info.update(layer.feature.properties);
}

// var geojson = L.geoJson();

export const resetHighlight = function (e) {
    var layer = e.target;
    layer.setStyle({
        weight: 2,
        opacity: 0,
        color: 'white',
        dashArray: 8,
        fillColor:"white",
        fillOpacity:0
    });
     Session.set("AreaAdmin","");
     info.update();
     Session.set("gUncharted",true);

}

export const onEachFeature = function (feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
    });
}