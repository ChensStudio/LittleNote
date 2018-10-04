// on startup run resizing event
Meteor.startup(function() {
  $(window).resize(function() {
    $('#map').css('height', window.innerHeight - 82 - 45);
  });
  $(window).resize(); // trigger resize event 
});
 
// create marker collection
var Markers = new Meteor.Collection('markers');

Meteor.subscribe('markers');

var currLatitude, currLongitude;

Template.map.rendered = function() {
  var setPosition =  function(position) {
    currLongitude = position.coords.longitude;
    currLatitude = position.coords.latitude;
    if (map) {
      map.setView([currLatitude, currLongitude], 4);
    }
  }
  L.Icon.Default.imagePath = '/packages/bevanhunt_leaflet/images/';

  var map = L.map('map', {
    doubleClickZoom: false
  }).setView([49.25044, -123.137], 13);
  navigator.geolocation.getCurrentPosition(setPosition);
  // var map = L.map('map', {
  //   doubleClickZoom: false
  // }).setView([currLatitude, currLongitude], 13);

  // L.tileLayer.provider('Stamen.Terrain', {maxZoom: 16}).addTo(map);
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'sk.eyJ1IjoiYmlhamVlIiwiYSI6ImNqbXN2eWtpazI5emszcGs0MDdnc2JheGUifQ.bBoM1hQuhMOtL8bl87EtBg'
  }).addTo(map);

  map.on('dblclick', function(event) {
    Markers.insert({latlng: event.latlng});
  });


  var popup = L.popup();
  map.on('click', function(event) {
    popup
      .setLatLng(event.latlng)
      .setContent("You clicked the map at " + event.latlng.toString())
      .openOn(map);
  });

  var polygon;
  map.on('mousemove', function(event) {
    if (polygon) {
      map.removeLayer(polygon);
    }

    var latFloor = Math.floor(event.latlng.lat * 10)/10;
    var latCeil = Math.ceil(event.latlng.lat * 10)/10;
    var lngFloor = Math.floor(event.latlng.lng * 10)/10;
    var lngCeil = Math.ceil(event.latlng.lng * 10)/10;

    var latlngs = [[latFloor, lngFloor],[latFloor, lngCeil],[latCeil, lngCeil],[latCeil, lngFloor]];
    polygon = L.polygon(latlngs, {color: 'green'}).addTo(map);
  });

  // add clustermarkers
  var markers = L.markerClusterGroup();
  map.addLayer(markers);

  var query = Markers.find();
  query.observe({
    added: function (document) {
      var marker = L.marker(document.latlng)
        .on('click', function(event) {
          Markers.remove({_id: document._id});
        });
       markers.addLayer(marker);
    },
    removed: function (oldDocument) {
      layers = map._layers;
      var key, val;
      for (key in layers) {
        val = layers[key];
        if (val._latlng) {
          if (val._latlng.lat === oldDocument.latlng.lat && val._latlng.lng === oldDocument.latlng.lng) {
            markers.removeLayer(val);
          }
        }
      }
    }
  });
};
