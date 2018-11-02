import {dateFormat, getGrid, getGrid10, getPrice, getLatLng4, displayCoordinates} from './utils.js';
import {Notes} from '../imports/api/notes/notes.js';
import {insert} from '../imports/api/notes/methods.js';
import {Accounts} from '../imports/api/accounts/accounts.js';
import {accountinsert} from '../imports/api/accounts/methods.js';
import lightwallet from 'eth-lightwallet';
import UserInfo from './lib/userinfo.min.js';
import MoacConnect from './moacconnect.js';
// import {encode, decode} from 'rlp';

var Markers = Notes;

var currLatitude, currLongitude;
var map;
var gUserAddress;
var gUserName; 

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
    console.log("accounts", chain3js.mc.accounts);

    MoacConnect.GetInstance();
    // moacSetupContract();
    // chain3js.mc.sendTransaction({
    //   from: chain3js.mc.accounts[0], 
    //   to: '0x3e14313E492cC8AF3abda318d5715D90a37Be587', 
    //   value: 1000000000000000000,
    //   data: '',
    //   gasPrice: 100000000000
    // },
    // console.log);
  } else {
    console.log('No chain3? You should consider trying MoacMask!')
    // chain3js - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    try {
      global.chain3js = new Chain3(new Chain3.providers.HttpProvider("http://localhost:8545"));
      moacSetupContract();
    } catch (err) {
      console.log('Error', err);
      //if pc user
      alert('Please install MOACMask wallet.\n\nFor crypto geeks who will run local nodes, you can run a local MOAC node at port 8545');
      //if mobile user

    }
  }
});

var getUserAddress = function() {
  console.log('getUserAddress');
  try {
    gUserAddress = chain3js.mc.accounts[0];
    var accountInterval = setInterval(function() {
      if (chain3js.mc.accounts[0] !== gUserAddress) {
        gUserAddress = chain3js.mc.accounts[0];
        console.log('gUserAddress is updated to [' + gUserAddress + ']');
        loadUserName();
      }
    }, 500);
  } catch (err) {
    console.log('Error', err);
    //if pc user
    alert('Please install MOACMask wallet.\n\nFor crypto geeks who will run local nodes, you can run a local MOAC node at port 8545');
    //if mobile user
  }
}

var loadUserName = function() {
  var accounts = Accounts.find({address: gUserAddress}).fetch();
  console.log('loadUserName', gUserAddress, "accounts", accounts);
  if (accounts.length>0) {
    gUserName = accounts[0].name;
  }
  console.log('gUserName', gUserName);
}

var popUserInfo = function(callback) {
  console.log('popUserInfo');
  getUserAddress();
  if (gUserAddress) {
    loadUserName();
    if (callback) {
      var userInfo = {
        address: gUserAddress,
        name: gUserName
      };
      callback(null, userInfo);
    }
  } else if (callback) {
    callback(null, null);
  }
}

var createNewAddress = function() {
  console.log('createNewAddress');
  var address = createNewAddressOnMOAC();
  return address;
}

var createNewUserName = function(address, userName) {
  console.log('createNewUserName', address, userName);
  var result = MoacConnect.AddUser(userName, address, function(e, c){
    console.log('MoacConnect.AddUser callback', e, c);
    accountinsert.call({
      name: userName,
      address: address
    }, (err)=>{
      if (err) {
        alert(err.message);
      }
    });
  });
}

var global_keystore;

var newWallet = function() {
  var extraEntropy = '';
  var randomSeed = lightwallet.keystore.generateRandomSeed(extraEntropy);
  var infoString = 'Your new wallet seed is: "' + randomSeed + 
  '". Please write it down on paper or in a password manager, you will need it to access your wallet. Do not let anyone see this seed or they can take your Ether. ' +
  'Please enter a password to encrypt your seed while in the browser.'
  // var password = prompt(infoString, 'Password');
  console.log('randomSeed', randomSeed);
  var password = 'testtest';
  lightwallet.keystore.createVault({
      password: password,
      seedPhrase: randomSeed,
      //random salt 
      hdPathString: "m/0'/0'/0'"
    }, 
    function (err, ks) {
      global_keystore = ks;
            
      newAddresses(password);
      // setWeb3Provider(global_keystore);
      // getBalances();
    }
  );
}

var newAddresses = function(password) {
  var numAddr = 1;
  global_keystore.keyFromPassword(password, function(err, pwDerivedKey) {
    global_keystore.generateNewAddress(pwDerivedKey, numAddr);
    var addresses = global_keystore.getAddresses();
    console.log('addresses', addresses);
    console.log('ks', global_keystore);
  });
}

var createNewAddressOnMOAC = function() {  
  chain3js.mc.sendTransaction({
      from: chain3js.mc.accounts[0],
      to: chain3js.mc.accounts[0],
      value: 0,
      gas: 5000000,
      gasPrice: 20000000000
  }, function (error, result) {
      if (error) {
          document.getElementById('output').innerHTML = "Something went wrong!"
      } else {
          document.getElementById('output').innerHTML = "Track the payment: <a href='https://etherscan.io/tx/" + result + "'>https://etherscan.io/tx/" + result + "'"
      }
  });
  newWallet();
}

var isFromChina = function(callback) {
  UserInfo.getInfo(function(data) {
    // the "data" object contains the info
    if (data.country.code == 'CN') {
      callback(true);
      // load your fallback fonts
    } else {
      callback(false);
      // Load your google fonts
    }
  }, function(err) {
      callback(false);
    // the "err" object contains useful information in case of an error
  });
}

var toCreateNote = function(latlng, noteText, forSell, priceLimit, freeFlag) {
  var latlng4 = getLatLng4(latlng);
  var grid = getGrid(latlng4);
  var grid10 = getGrid10(latlng4);
  var forSell = true;
  var inserts = {
    address: gUserAddress,
    latlng: latlng4,
    grid: grid,
    grid10: grid10,
    noteText: noteText,
    forSell: forSell
  };

  var byMyselfFlag = true;
  if (freeFlag) {
    chain3js.mc.getBalance(gUserAddress, function(err, balance) {
      if (balance < gThresholdBalance) {
        //offer create notes without fee.
        byMyselfFlag = false;
        creatNote(byMyselfFlag, inserts);
      } else {
        createNote(byMyselfFlag, inserts);
      }
    });
  } else {
    createNote(byMyselfFlag, inserts);
  }


}

var getCreateNoteData = function(byMyselfFlag, inserts) {
  var data = '';
  return data;
}

var createNote = function(byMyselfFlag, inserts) {
  console.log('createNote', byMyselfFlag, inserts);
  var data = getCreateNoteData(byMyselfFlag, inserts);
  //1) try to sign the 
  if (!byMyselfFlag) {
    //2) do transaction for the user
    createNoteInDatabase(inserts);
  } else {
    //3) do the transaction by myself
    chain3js.mc.sendTransaction({
      from: gUserAddress,
      to: gContractAddress,
      value: 1,
      data: data,
      gasPrice: 20000000000,
      gas: 5000000
    }, function (error, result) {
      if (error) {
        console.log("error", error);
        //do not try to push into database
      } else {
        //push into database
        createNoteInDatabase(inserts);
      }
    });
  }
}

var createNoteInDatabase = function(inserts) {
  // console.log('inserts', inserts);
  insert.call(inserts
  , (err, result)=>{
    if (err) {
      console.log('createNoteInDatabase error', inserts, err);
    } else {
      console.log('createNoteInDatabase succeeded', inserts, result);
    }
  });
  // Notes.insert(userAddress, coordinates, grid, grid10, noteText, forSell);
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
      price += ' ' + TAPi18n.__("app.Unit");
    }
    else{
      price = TAPi18n.__("app.Free");
    }

    var content = TAPi18n.__("app.Price") + price;
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

  var createNoteModal = function(popup, latlng, noteText, userName) {
    popUserInfo(function(e, userInfo) {
      console.log('createNoteModal userInfo', userInfo);

      if (!userInfo) {
        if (!gUserAddress) {
          gUserAddress = createNewAddress();
        } 
      }

      if (!gUserName) {
        createNewUserName(gUserAddress, userName)
      }

      toCreateNote(latlng, noteText);

    });
  }

  L.Icon.Default.imagePath = '/packages/bevanhunt_leaflet/images/';

  map = L.map('map', {
    doubleClickZoom: false,
    worldCopyJump: true
  }).setView([49.25044, -123.137], 4);

  // L.tileLayer.provider('Stamen.Terrain', {maxZoom: 16}).addTo(map);
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors.'
  }).addTo(map);
  // L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  //     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  //     maxZoom: 18,
  //     id: 'mapbox.streets',
  //     accessToken: 'sk.eyJ1IjoiYmlhamVlIiwiYSI6ImNqbXN2eWtpazI5emszcGs0MDdnc2JheGUifQ.bBoM1hQuhMOtL8bl87EtBg'
  // }).addTo(map);

  map.addControl(L.control.locate({
    locateOptions: {
            enableHighAccuracy: true
  }}));

  // navigator.geolocation.getCurrentPosition(setPosition);

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
    if (!gUserName) {
      userNameDiv = '<label for="username">User name:</label><br><input class="username" type="text" name="username"/><br><br>';
    } else {
      userNameDiv = 'You will post as ' + gUserName + '<br><br>';
    }

    container.innerHTML = coordinates + ' <br>Your permanent note for ' + price + '<br><br><textarea class="notetobeposted" type="text" name="notetobeposted" maxlength="128" rows="4" cols="40"></textarea><br><br>' + userNameDiv;
    var postBtn = createButton('Post here.', container);

    L.DomEvent.on(postBtn, 'click', () => {
      // alert("toto");
      var noteText = $('.notetobeposted').val();
      var userName = $('.username').val();
      // alert(noteText);
      createNoteModal(popup, event.latlng, noteText, userName);
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