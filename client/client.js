
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
var gNoteCount;

var notesLoaded = false;
var accountsLoaded = false;

Meteor.subscribe('notesWithAccountName', function(){ notesLoaded = true; });
Meteor.subscribe('accounts', function(){ 
  console.log('meteor subscribe accounts');
  accountsLoaded = true; 
  monitorUserAddress();
});


var tooltip;
// var chain3js;

// on startup run resizing event
Meteor.startup(function() {
  $(window).resize(function() {
    $('#map').css('height', '550px');
  });
  $(window).resize(); // trigger resize event 

  MoacConnect.InitChain3();
});

var monitorUserAddress = function() {
  console.log('monitorUserAddress');
  try {
    gUserAddress = chain3js.mc.accounts[0];
    var dbAccount = loadUserName();
    if (gUserAddress) {
      MoacConnect.GetAccount(gUserAddress, function(err, result) {
        console.log('MoacConnect.GetAccount userInfo', result);
        if (gUserAddress) {
          if (dbAccount && result[1] !== '' && result[1] !== dbAccount.name) {

          }
        }
      });
      MoacConnect.GetJackpot(function(e,c) {
        console.log('potReserve', e, c.toString());
      })
    }
    var accountInterval = setInterval(function() {
      if (chain3js.mc.accounts[0] !== gUserAddress) {
        gUserAddress = chain3js.mc.accounts[0];
        console.log('gUserAddress is updated to [' + gUserAddress + ']');
        dbAccount = loadUserName();
        if (gUserAddress) {
          MoacConnect.GetAccount(gUserAddress, function(err, result) {
            console.log('MoacConnect.GetAccount userInfo', result);
          });
        }
        MoacConnect.GetJackpot(function(e,c) {
          console.log('potReserve', e, c.toString());
        })

      }
    }, 500);
  } catch (err) {
    console.log('Error', err);
    //if pc user
    alert('Please install MOACMask wallet.\n\nFor crypto geeks who will run local nodes, you can run a local MOAC node at port 8545');
    //if mobile user
  }
}

var updateDbAccount = function(userName, noteCount) {
  //accountupdates.call({
  //     address: gUserAddress
  //   }, 
  //   {
  //     name: userName,
  //     noteCounts: noteCount,
  //     onChainFlag: true
  //   },
  //   function(err, result) {

  //   }
  // );
}

var loadUserName = function() {
  var accounts = Accounts.find({address: gUserAddress}).fetch();
  console.log('loadUserName', gUserAddress, "accounts", accounts);
  if (accounts.length>0) {
    gUserName = accounts[0].name;
  }
  console.log('gUserName', gUserName, accounts[0]);
  return accounts[0];
}

var popUserInfo = function(callback) {
  console.log('popUserInfo');
  gUserAddress = chain3js.mc.accounts[0];
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

var createNewUserName = function(address, userName, callback) {
  console.log('createNewUserName', address, userName);
  accountinsert.call({
    name: userName,
    address: address
  }, (err, _id)=>{
    console.log('createNewUserName in database', err, _id);
    if (err) {
      alert(err.message);
      callback(err);
      return;
    }

    gUserName = userName;
    MoacConnect.AddUser(userName, address, function(e, c){
      console.log('MoacConnect.AddUser callback', e, c);
      callback(e, c);

      var totalTry = 600;
      var tryCount = 0;
      var addUserInterval = setInterval(function() {
        tryCount++;
        if (tryCount >= totalTry) {
          clearInterval(addUserInterval);
        }
        MoacConnect.GetAccount(address, function(e, c) {
          if (e) {
            console.log('MoacConnect.GetAccount error', e);
            return;
          }

          if (c[1] !== '' && c[1] === gUserName) {
            setOnChainFlag({
              accountId: _id,
              onChainFlag: true
            });
            clearInterval(addUserInterval);
          } else {
            console.log('Inconsistent userName', c[1], gUserName);
          }
        });
      }, 1000);
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
  var moacInserts = {
    address: gUserAddress,
    latlng: latlng4,
    lat: latlng4.lat,
    lng: latlng4.lng,
    grid: grid,
    grid10: grid10,
    noteText: noteText,
    forSell: forSell,
    value: priceLimit,
    purchasePrice: priceLimit,
    mediaFlag: false,
    _id: 'test',
    referral: 0
  };

  var mongoInserts = {
    address: gUserAddress,
    latlng: latlng4,
    grid: grid,
    grid10: grid10,
    noteText: noteText,
    forSell: forSell
  }

  var byMyselfFlag = true;
  if (freeFlag) {
    chain3js.mc.getBalance(gUserAddress, function(err, balance) {
      if (balance < gThresholdBalance) {
        //offer create notes without fee.
        byMyselfFlag = false;
        createNote(byMyselfFlag, moacInserts, mongoInserts);
      } else {
        createNote(byMyselfFlag, moacInserts, mongoInserts);
      }
    });
  } else {
    createNote(byMyselfFlag, moacInserts, mongoInserts);
  }


}

var createNote = function(byMyselfFlag, moacInserts, mongoInserts) {
  console.log('createNote', byMyselfFlag, moacInserts, mongoInserts);

  createNoteInDatabase(mongoInserts, function(err, _id) {
    console.log('createNoteInDatabase called', mongoInserts, err, _id);
    if (err) {
      console.log('createNoteInDatabase err', err);
      return;
    }

    moacInserts._id = _id;

    if (!byMyselfFlag) {
      MoacConnect.HelpAddNote(moacInserts, function(err, result){
        if (err) {
          console.log("error", err);
          return;
        }

        //TODO: update onChainFlag
      })
    } else {
      MoacConnect.AddNote(moacInserts, function(err, result) {
        console.log('MoacConnect.AddNote', moacInserts, err, result);
        if (err) {
          console.log("error", err);
          return;
        }

        //TODO: update onChainFlag
      });
    }
  });
}

var createNoteInDatabase = function(mongoInserts, callback) {
  console.log('createNoteInDatabase', mongoInserts);
  insert.call(mongoInserts, callback);
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

          //TODO: ask about whether to sign in on moacmask or create a new address.
          gUserAddress = createNewAddress();
        } 
      }

      if (!gUserName) {
        //TODO handle failure.
        createNewUserName(gUserAddress, userName, function(err, result) {
          if (err) {
            console.log('createNewUserName err', err);
            return;
          }

          toCreateNote(latlng, noteText);
        })
      } else {
        toCreateNote(latlng, noteText);
      }

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
      userNameDiv = '<label for="username">User name:</label><br><input class="username" type="text" name="username"/><br><div class="usernamebtn"></div><br><br>';
    } else {
      userNameDiv = 'You will post as ' + gUserName + '<br><br>';
    }
     
    
    container.innerHTML = '</div>' + coordinates + ' <br>Your permanent note for ' + price + '<br><br><textarea class="notetobeposted" type="text" name="notetobeposted" maxlength="128" rows="4" cols="40"></textarea><br><br>' + userNameDiv;
    // var canvas = $('#cvs')[0];
    
    var postBtn = createButton('Post here.', container);   
    var getQR = createButton('getQR', container);

     L.DomEvent.on(getQR,'click',()=>{
      console.log($(".notetobeposted"))
      var data = $('.notetobeposted').val();
      var TX = `moac:${global.gContractAddress}?data=${data}&amount=<amount>&token=MOAC`;
      Modal.show('qrModal',{data:TX});
       // QRCode.toCanvas(canvas, TX, function (error,suc) {
       //  if (error) console.error(error)
       //  console.log('success!');
       //  })
     })

    if (!gUserName) {
      var userNameContainer = container.childNodes[12];
      var userNameBtn = createButton('Create User', userNameContainer);

      L.DomEvent.on(userNameBtn, 'click', () => {
        // alert("toto");
        var userName = $('.username').val();
        // alert(noteText);
        createNewUserName(gUserAddress, userName, function(e, c) {
          if (!e) {
            userNameBtn.setAttribute('disabled', true);
            postBtn.removeAttribute('disabled');
          }
        });
        // createNoteModal(popup, event.latlng, noteText, userName);
      });
      postBtn.setAttribute('disabled', true);
    }


    L.DomEvent.on(postBtn, 'click', () => {
      // alert("toto");
      var noteText = $('.notetobeposted').val();
      var userName = $('.username').val();
      // alert(noteText);
      createNoteModal(popup, event.latlng, noteText, userName);
      map.closePopup();
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
