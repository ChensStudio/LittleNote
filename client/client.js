import {dateFormat, getGrid, getGrid10, getPrice} from './utils.js';
import {Notes} from '../imports/api/notes/notes.js';
import {insert} from '../imports/api/notes/methods.js';
import {Accounts} from '../imports/api/accounts/accounts.js';
import lightwallet from 'eth-lightwallet';

var Markers = Notes;

var currLatitude, currLongitude;
var map;
var userAddress;
var userName;

var notesLoaded = false;
var accountsLoaded = false;

Meteor.subscribe('notesWithAccountName', function(){ notesLoaded = true; });
Meteor.subscribe('accounts', function(){ 
  accountsLoaded = true; 
  popUserInfo();
});

var tooltip;
// var chain3js;

// on startup run resizing event
Meteor.startup(function() {
  $(window).resize(function() {
    $('#map').css('height', window.innerHeight - 82 - 45);
  });
  $(window).resize(); // trigger resize event 

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof chain3 !== 'undefined') {
    console.log("chain3 is defined");
    // Use Mist/MetaMask's provider
    global.chain3js = new Chain3(chain3.currentProvider);
  } else if (typeof web3 !== 'undefined') {
    console.log("web3 is defined");
    // Use Mist/MetaMask's provider
    global.chain3js = new Chain3(web3.currentProvider);
  } else {
    console.log('No chain3? You should consider trying MetaMask!')
    // chain3js - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    global.chain3js = new Chain3(new Chain3.providers.HttpProvider("http://localhost:8545"));
  }

});
 
var getUserAddress = function() {
  userAddress = chain3js.mc.accounts[0];

  var accountInterval = setInterval(function() {
    if (chain3js.mc.accounts[0] !== userAddress) {
      userAddress = chain3js.mc.accounts[0];
    }
  }, 500);
}

var loadUsername = function() {
  var accounts = Accounts.find({address: userAddress}).fetch();
  console.log(userAddress, "accounts", accounts);
  if (accounts.length>0) {
    userName = accounts[0].name;
  }
  console.log('userName', userName);
}

var popUserInfo = function(callback) {
  getUserAddress();
  if (userAddress) {
    loadUsername();
    if (callback) {
      var userInfo = {
        address: userAddress,
        name: userName
      };
      callback(e, userInfo);
    }
  } else if (callback) {
    callback(e, null);
  }
}

var getLatLng4 = function(latlng) {
  var lat4 = Math.floor(latlng.lat * 10000 + 0.5) / 10000;
  var lng4 = Math.floor(latlng.lng * 10000 + 0.5) / 10000;

  return {lat: lat4, lng: lng4};
}

var displayCoordinates = function(latlng) {
  console.log('latlng', latlng);

  var latAbs = Math.abs(latlng.lat.toFixed(4));
  var lngAbs = Math.abs(latlng.lng.toFixed(4));

  var lat = latlng.lat > 0 ? latAbs + ' N' : latAbs + ' S';
  var lng = latlng.lng > 0 ? lngAbs + ' E' : lngAbs + ' W';
  return lat + ', ' + lng;
}

var createNewAddress = function(userName) {
  var address = createNewAddressOnMOAC();
  // createNewUserNameOnMOAC(address, userName);
}

var createNewAddressOnMOAC = function() {
  // generate a new BIP32 12-word seed
  var secretSeed = lightwallet.keystore.generateRandomSeed();
  console.log('secretSeed', secretSeed);

  // the seed is stored encrypted by a user-defined password
  // var password = prompt('Enter password for encryption', 'password');
  var password = '';
  lightwallet.keystore.deriveKeyFromPasswordAndSalt(password, '', function (err, pwDerivedKey) {
    if (err) {
      console.log('err', err);
    }
    
    var ks = new lightwallet.keystore(secretSeed, pwDerivedKey);

    // generate five new address/private key pairs
    // the corresponding private keys are also encrypted
    ks.generateNewAddress(pwDerivedKey, 5);
    var addr = ks.getAddresses();
    console.log('ks', addr, pwDerivedKey);
    // Create a custom passwordProvider to prompt the user to enter their
    // password whenever the hooked web3 provider issues a sendTransaction
    // call.
    ks.passwordProvider = function (callback) {
      var pw = prompt("Please enter password", "Password");
      callback(null, pw);
    };

  // Now set ks as transaction_signer in the hooked web3 provider
  // and you can start using web3 using the keys/addresses in ks!
  });

  // lightwallet.keystore.createVault({
  //   // password: '',
  //   // seedPhrase: seedPhrase, // Optionally provide a 12-word seed phrase
  //   // salt: fixture.salt,     // Optionally provide a salt.
  //                              // A unique salt will be generated otherwise.
  //   hdPathString: hdPath    // Optional custom HD Path String
  // }, function (err, ks) {
  //     if (err) {
  //       console.log('err0', err);
  //     }
  //   // Some methods will require providing the `pwDerivedKey`,
  //   // Allowing you to only decrypt private keys on an as-needed basis.
  //   // You can generate that value with this convenient method:
  //   ks.keyFromPassword('', function (err, pwDerivedKey) {
  //     if (err) {
  //       console.log('err', err);
  //     }

  //     // generate five new address/private key pairs
  //     // the corresponding private keys are also encrypted
  //     ks.generateNewAddress(pwDerivedKey, 5);
  //     var addr = ks.getAddresses();
  //     console.log('ks', addr, pwDerivedKey);

  //     ks.passwordProvider = function (callback) {
  //       var pw = prompt("Please enter password", "Password");
  //       callback(null, pw);
  //     };

  //     // Now set ks as transaction_signer in the hooked web3 provider
  //     // and you can start using web3 using the keys/addresses in ks!
  //   });
  // });
  // var account = chain3js.personal.newAccount();
  // console.log('createNewAddressOnMOAC', account);
}

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
    // console.log('updateTooltip');
    var price = getPrice(grid10, false, true);
    if (price != 'FREE') {
      price += ' MOAC';
    }
    var content = 'Price: ' + price;
    tooltip
      .setContent(content)
      .updatePosition(evt.layerPoint);
    tooltip.show();
  }

  var createButton = function(label, container) {
    var btn = L.DomUtil
      .create('button', 'postbtn', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
  }

  var createNoteModal = function(popup, latlng, noteText) {
    popUserInfo(function(e, userInfo) {
      console.log('createNoteModal userInfo', userInfo);
      createNewAddress();
      if (userInfo) {
        var latlng4 = getLatLng4(latlng);
        var grid = getGrid(latlng4);
        var grid10 = getGrid10(latlng4);
        var forSell = true;
        var inserts = {
          address: userAddress,
          latlng: latlng4,
          grid: grid,
          grid10: grid10,
          noteText: noteText,
          forSell: true,
        };
        // console.log('inserts', inserts);
        insert.call(inserts
        , (err)=>{
              alert(err.message);
        });
        // Notes.insert(userAddress, coordinates, grid, grid10, noteText, forSell);
      } else {
        if (!userAddress) {
          createNewAddress();
        } else if (!userName) {
          createNewUser(function(e) {

          })
        }
      }
    });
    // console.log('userAddress', userAddress);
    // var container = L.DomUtil.create('div');
    // var grid10 = getGrid10(coordinates);
    // var price = getPrice(grid10, selfFlag, false);

    // if (price == 0) {
    //   container.innerHTML = coordinates + ' <br>Write down your first permanent note.<br><br><input type="text" maxlength="128" name="note"><br>';
    // }

    // var postBtn = createButton('Sign and Post', container);

    // popup.setContent(container);

  }

  L.Icon.Default.imagePath = '/packages/bevanhunt_leaflet/images/';
  
    //Read from mongo
  //console.log(Notes.find({}));

  map = L.map('map', {
    doubleClickZoom: false,
    worldCopyJump: true
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
    if (event.originalEvent && event.originalEvent.key == "Enter") {
      return;
    }

    var coordinates = displayCoordinates(event.latlng);
    var grid10 = getGrid10(event.latlng);
    console.log("map on click");
    var price = getPrice(grid10, false, true);
    if (price != 'FREE') {
      price += ' MOAC';
    }

    var userNameDiv = '';
    if (!userName) {
      userNameDiv = '<label for="username">User name:</label><br><input class="username" type="text" name="username"/><br><br>';
    } else {
      userNameDiv = 'You will post as ' + userName + '<br><br>';
    }

    container.innerHTML = coordinates + ' <br>Your permanent note for ' + price + '<br><br><textarea class="notetobeposted" type="text" name="notetobeposted" maxlength="128" rows="4" cols="40"></textarea><br><br>' + userNameDiv;
    var postBtn = createButton('Post here.', container);

    L.DomEvent.on(postBtn, 'click', () => {
      // alert("toto");
      var noteText = $('.notetobeposted').val();
      // alert(noteText);
      createNoteModal(popup, event.latlng, noteText);
    });

    popup
      .setLatLng(event.latlng)
      .setContent(container)
      .openOn(map);

    $('.notetobeposted').focus();

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
      var marker = L.marker(document.latlng, {
        icon: new L.DivIcon({
            className: 'marker-tooltip',
            html: '<div class="markertooltip"><div class="markertooltip-tip-container"><div class="markertooltip-tip"></div></div><div class="markertooltip-inner">' + document.note + '</div></div>'
        })})
        .on('click', function(event) {
          Template.map.moveto(document.latlng.lat, document.latlng.lng, document._id);
          // Markers.remove({_id: document._id});
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
    console.log("note forsell")
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