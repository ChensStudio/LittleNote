import {Notes} from '../imports/api/notes/notes.js';
import {insert} from '../imports/api/notes/methods.js';
import {Accounts} from '../imports/api/accounts/accounts.js';
import {dateFormat, getPrice, getGrid, getGrid10} from './utils.js';

Meteor.subscribe('notes');
Meteor.subscribe('accounts');

var tooltip;

// on startup run resizing event
Meteor.startup(function() {
  $(window).resize(function() {
    $('#map').css('height', window.innerHeight - 82 - 45);
  });
  $(window).resize(); // trigger resize event 
});
 
var Markers = Notes;

var currLatitude, currLongitude;
var map;

Template.map.rendered = function() {
  var setPosition =  function(position) {
    currLongitude = position.coords.longitude;
    currLatitude = position.coords.latitude;
    if (map) {
      map.setView([currLatitude, currLongitude], 4);
    }
  }

  var updateTooltip = function(evt) {
    var grid10 = getGrid10(evt.latlng);
    var price = getPrice(grid10, false, true);
    if (price != 'FREE') {
      price += 'MC';
    }
    var content = 'Price: ' + price;
    tooltip
      .setContent(content)
      .updatePosition(evt.layerPoint);
    tooltip.show();
  }

  var displayCoordinates = function(latlng) {
    console.log('latlng', latlng);

    var latAbs = Math.abs(latlng.lat.toFixed(4));
    var lngAbs = Math.abs(latlng.lng.toFixed(4));

    var lat = latlng.lat > 0 ? latAbs + ' N' : latAbs + ' S';
    var lng = latlng.lng > 0 ? lngAbs + ' E' : lngAbs + ' W';
    return lat + ', ' + lng;
  }

  var createButton = function(label, container) {
    var btn = L.DomUtil
      .create('button', 'postbtn', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
  }

  L.Icon.Default.imagePath = '/packages/bevanhunt_leaflet/images/';

  //Read from mongo
  //console.log(Notes.find({}));

  map = L.map('map', {
    doubleClickZoom: false
  }).setView([49.25044, -123.137], 4);

  // L.tileLayer.provider('Stamen.Terrain', {maxZoom: 16}).addTo(map);
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'sk.eyJ1IjoiYmlhamVlIiwiYSI6ImNqbXN2eWtpazI5emszcGs0MDdnc2JheGUifQ.bBoM1hQuhMOtL8bl87EtBg'
  }).addTo(map);

  navigator.geolocation.getCurrentPosition(setPosition);

  map.on('dblclick', function(event) {
    // Markers.insert({latlng: event.latlng});
    insert.call(
      {
        address: '0x12345567789000',
        latlng: {lng:event.latlng.lng, lat:event.latlng.lat},
        grid: Math.floor((event.latlng.lng + 360) * 100) * 100000 + Math.floor((event.latlng.lat + 360) * 100),
        noteText: 'static test',
        forSell: false,
      }, (err)=>{
            alert(err.message);
      });
  });


  var popup = L.popup();
  var container = L.DomUtil.create('div');
  map.on('click', function(event) {
    var coordinates = displayCoordinates(event.latlng);
    var grid10 = getGrid10(event.latlng);
    var price = getPrice(grid10, false, true);
    if (price != 'FREE') {
      price += 'MC';
    }

    container.innerHTML = coordinates + ' <br>Your permanent note for ' + price + '<br><br>';
    var postBtn = createButton('Post here.', container);

    L.DomEvent.on(postBtn, 'click', () => {
      alert("toto");
    });

    popup
      .setLatLng(event.latlng)
      .setContent(container)
      .openOn(map);

    L.DomEvent.on(popup._container, 'mousemove', function(e) {
      // console.log("mousemove popup._container");
      e.preventDefault();
      e.stopPropagation();
      if (tooltip) {
        tooltip.hide();
      }
    })
  });

  var bounds = map.getBounds().pad(0.25); // slightly out of screen
  tooltip = L.tooltip({
    position: 'bottom',
    noWrap: true
  })
    .addTo(map)
    .setContent('Start drawing to see tooltip change')
    .setLatLng(new L.LatLng(bounds.getNorth(), bounds.getCenter().lng));

  var polygon;
  map.on('mousemove', function(event) {
    if (polygon) {
      map.removeLayer(polygon);
    }

    if (tooltip) {
      updateTooltip(event);
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
        .bindTooltip('test', 
        {
            permanent: true, 
            direction: 'right'
        })
        .on('click', function(event) {
          Template.map.moveto(document.latlng.lat, document.latlng.lng, document._id);
          // Markers.remove({_id: document._id});
        });
       markers.addLayer(marker);
       // marker.bindTooltip('test', 
       //  {
       //      permanent: true, 
       //      direction: 'right'
       //  })

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

Template.map.moveto = function(lat, lng, noteid, zoomFlag) {
  var n = Notes.find({_id: noteid}).fetch();
  var note;
  if (n.length > 0) {
    note = n[0];
    var accounts = Accounts.find({address: note.address}).fetch();
    if (accounts.length > 0) {
      note.name = accounts[0].name;
    }
    note.displayDate = dateFormat(note.updatedAt);
  }
  var content = '<div class="notevalue"><div><span class="notelink"><a href="https://google.com"><i class="fas fa-link"></i></a></span><span class="noteuser"> ' + note.name + '  </span><span class="notetime">' + note.displayDate + '</span></div><div class="popupnoteaccount">' + note.address + '</div><div class="popupnotetext">' + note.note + '</div><br><br><div><span class="notecoordinates">lat: ' + note.latlng.lat + '   lng: ' + note.latlng.lng + '</span>';
  if (note.forSell) {

    var price = getPrice(note.grid10, true);
    // console.log("popup price", price);
    content += '<br><br><span class="popupforsell">Buy this Note for ' + price + ' MOAC</span>';
  }
  content +='</div></div>';
  if (zoomFlag) {
    map.setView([lat, lng], 10);
  } else {
    map.setView([lat, lng]);
  }
  if (noteid) {
    var popup = L.popup();
    popup
      .setLatLng({lat:lat, lng:lng})
      .setContent(content)
      .openOn(map);
    console.log("popup", popup);
    L.DomEvent.on(popup._container, 'mousemove', function(e) {
      // console.log("mousemove popup._container");
      e.preventDefault();
      e.stopPropagation();
      if (tooltip) {
        tooltip.hide();
      }
    })
  }
}