import {dateFormat, getGrid, getGrid10, getPrice, getLatLng4, displayCoordinates} from './utils.js';
import {Notes} from '../imports/api/notes/notes.js';
import {insert} from '../imports/api/notes/methods.js';
import {Accounts} from '../imports/api/accounts/accounts.js';
import {accountinsert, setOnChainFlag} from '../imports/api/accounts/methods.js';
import lightwallet from 'eth-lightwallet';
import UserInfo from './lib/userinfo.min.js';
import MoacConnect from './moacconnect.js';
import { Random } from 'meteor/random';
import {insertquestion,latestAnswer} from '../imports/api/questions/methods.js';
import {Questions} from '../imports/api/questions/questions.js';


// import {encode, decode} from 'rlp';
// import { statesData } from './statesData'
// $(document).width() = document.width()*2;

// console.log("random Id",Random.id(17));
var Markers = Notes;
var games = Questions;
var currLatitude, currLongitude;
var map;
var gUserAddress;
var gUserName;
var gNoteCount;
var notesLoaded = false;
var accountsLoaded = false;
var overlap = false;
var rad = 50;

global.gSetGame = false;
global.gInArea = false;
Session.set("gAreaid", "");

// $(window).resize(function(){
//   console.log('browser width',$(window).width())
// })


Meteor.subscribe('notesWithAccountName', function(){ notesLoaded = true; });
Meteor.subscribe('accounts', function(){ 
  console.log('meteor subscribe accounts');
  accountsLoaded = true; 
  monitorUserAddress();
});

var tooltip;
var error_marker;
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
    Session.set('gUserAddress',gUserAddress);
    var dbAccount = loadUserName();
    console.log('dbAccount',dbAccount);
    if (gUserAddress) {
      MoacConnect.GetAccount(gUserAddress, function(err, result) {
        console.log('MoacConnect.GetAccount userInfo', result);
        if (gUserAddress) {
          if (dbAccount && result[1] !== '' && result[1] !== dbAccount.name) {
             gUserName = result[1];
          }
        }
      });
      MoacConnect.GetJackpot(function(e,c) {
        console.log('potReserve', e, c.toString());
      })
    }
    var accountInterval = setInterval(function() {
      if (chain3js.mc.accounts[0] !== gUserAddress) {
        if (gSetGame == true){
          gSetGame = false;
          Template.map.exitSetGame();
          Session.set("gAreaid","");
        }
        
        gUserName = '';
        Session.set('gUserAddress',chain3js.mc.accounts[0]);
        chain3js.mc.getBalance(chain3js.mc.accounts[0],function(e,r){
            if(e){
                console.log(e);
            }
            else{
                console.log('r = ',r);
                var balance = r.toNumber()/1e18;
                // TemplateVar.set(template,'balance',balance.toFixed(3));
                Session.set('balance',balance);
                console.log('balance = ',typeof balance);
            }
        });
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

    MoacConnect.AddUser(userName, address, function(e, c){
      if (!e){
      Session.set("loadContent","Deploying your profile to chain, please wait");
      $('div.loaderBack').show();
      console.log('MoacConnect.AddUser callback', e, c);

      var AddUserEvent = gContractInstance.AddAccountEvent(function(error,result){
        if(!error){
          $('div.loaderBack').hide();
          AddUserEvent.stopWatching();
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
                    else{
                        gUserName = userName;
                        callback(e, c);
                   //      setOnChainFlag.call({
                   //      accountId: _id,
                   //      onChainFlag: true
                   // });
                    }
            });
        }
      })
        
      }
      
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

var toCreateNote = function(latlng, noteText, priceLimit, freeFlag) {
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

   moacInserts._id = Random.id(17);
   mongoInserts._id = moacInserts._id;
   console.log("random id", moacInserts._id);
    if (!byMyselfFlag) {
      MoacConnect.HelpAddNote(moacInserts, function(err, result){
        if (err) {
          console.log("error", err);
          return;
        }
        else{
         createNoteInDatabase(mongoInserts, function(err, _id) {
              console.log('createNoteInDatabase called', mongoInserts, err, _id);
              if (err) {
              console.log('createNoteInDatabase err', err);
              return;
          }
              });
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
        else{
           Session.set("loadContent","Deploying your note to chain, please wait");
           $('div.loaderBack').show();
          var AddNoteEvent = gContractInstance.AddNoteEvent(function(error,result){
            if(!error){
               $('div.loaderBack').hide();
               createNoteInDatabase(mongoInserts, function(err, _id) {
                  console.log('createNoteInDatabase called', mongoInserts, err, _id);
                  if (err) {
                   console.log('createNoteInDatabase err', err);
                  return;
                  }
                  });
               AddNoteEvent.stopWatching();
               map.closePopup();
            }
          })
           
        }
        //TODO: update onChainFlag
      });
    }
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
      map.setView([currLatitude, currLongitude], 15);
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
        var grid10 = getGrid10(latlng);
        var price = getPrice(grid10,false, false)
        toCreateNote(latlng, noteText,price);
      }
    });
  }

  // L.Icon.Default.imagePath = '/packages/bevanhunt_leaflet/images/';
  map = L.map('map', {
    doubleClickZoom: true,
    worldCopyJump: true
  }).setView([49.25044, -123.137], 15);

  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors.',
    minZoom: 1,
    maxZoom: 19
  }).addTo(map);

  // L.geoJson(statesData).addTo(map);
  

  map.addControl(L.control.locate({
    locateOptions: {
            enableHighAccuracy: true
  }}));

  navigator.geolocation.getCurrentPosition(setPosition);

  var popup = L.popup();
  var container = L.DomUtil.create('div','popup_container');

  
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
    var createUserDiv = '';
    if (!gUserName) {
      createUserDiv = '<div class="creatediv"><div style="display:flex;padding-left:20px"><input class="username" type="text" placeholder="Username"/><div class="usernamebtn"></div><button id="createuser">create</button></div></div></div>';
    } else {
      userNameDiv = '—' + gUserName;
    }

    var header = '<div style="text-align:center;transition: all 0.8s ease 0s;"><p style="font-weight:bolder;margin:0 auto">' + coordinates + 
    '</p><p style="margin:6px auto">Your permanent note for ' + price + '</p><hr class="divider" style="margin-bottom:5px; margin-top:15px;transition: all 0.8s ease 0s;"></div>';
    var body = '<div style="margin-top:1px">' + createUserDiv + 
    '<textarea class="notetobeposted" type="text" style="margin-left:5%" maxlength="128" rows="4" cols="40" placeholder="type your note here....."></textarea><span id="signature">' + userNameDiv + '</span></div>';
    var footer = '<hr class="divider" style="margin-top:5px;margin-bottom:15px"><div style="display:flex"><span style="margin:0 auto"><button id="post" >post</button><button id="getqr" value="QR">QR</button></span></div>';
     
    container.innerHTML = header + body + footer;
    // var canvas = $('#cvs')[0];
    
    if (overlap === false && gSetGame === false){ //set regular note if not under setgame model
    popup
      .setLatLng(event.latlng)
      .setContent(container)
      .openOn(map);
    }
    else if (overlap === true){
     error_marker = L.marker([event.latlng.lat,event.latlng.lng],{
        icon: new L.DivIcon({
            className: 'error_marker',
            iconAnchor:[10,65],
            html: '<div class="errormarkertip"><div class="errormarker-tip-container"><div class="errormarker-tip"></div></div><div class="errormarker-inner">Too Close</div></div>'
        })})
    .addTo(map);
     error_marker.setZIndexOffset(1000);
     tooltip.hide();
    // error_marker.bringToFront();
    }
    else {
        if (gInArea === true) {
          var lg = {lat: event.latlng.lat, lng: event.latlng.lng};
          var header = '<div style="text-align:center;transition: all 0.8s ease 0s;"><p style="font-weight:bolder;margin:0 auto">' + coordinates + 
           '</p><hr class="divider" style="margin-bottom:5px; margin-top:15px;transition: all 0.8s ease 0s;"></div>';
          var body = '<div style="margin-top:1px"><textarea class="notetobeposted" type="text" style="margin-left:5%" maxlength="128" rows="4" cols="40" placeholder="Set your Question here....."></textarea></div>';
         
          var footer = '<hr class="divider" style="margin-top:5px;margin-bottom:15px"><div style="display:flex"><span style="margin:0 auto"><button id="submitQuestion" class="btn-grey">Submit</button></span></div>';
          container.innerHTML = header + body + footer;

        popup
          .setLatLng(event.latlng)
          .setContent(container)
          .openOn(map);

          $('#submitQuestion').click(function(){
            let questionId = Random.id(17);
            let content = $('.notetobeposted').val();
            let gAreaid = Session.get("gAreaid");
            let answerCost = 0.1;

            var question = {
            _id:questionId,
            admin: chain3js.mc.accounts[0],
            areaid:gAreaid,
            latlng:lg,
            noteText:content,
            answers:[],
            // answerCost:answerCost,
            startTime:new Date(),
            endTime:new Date(new Date().getTime() + 1000*60*4)
           }

          MoacConnect.AddGame(
            questionId, 
            gAreaid,
            chain3js.mc.accounts[0],
            lg.lat,
            lg.lng,
            Math.round(question.startTime.getTime()/1000),
            Math.round(question.endTime.getTime()/1000),
            content,
            answerCost*1e18,
            function(e,r){
              if(e){
                alert('fail to write game to chain');
              }
              else{
                // var errorMsg = Meteor.setTimeout(
                //   function(){
                //     AddGameEvent.stopWatching();
                //     alert("Fail to write Game to chain, Please try again later")
                //   },1000*60*3);
                Session.set("loadContent","Deploying Game to chain, please wait");
                $('div.loaderBack').show();
                var AddGameEvent = gAreaGameContractInstance.AddGameEvent(function(error,result){
                  if(error){
                    console.log("error on write area info to chain:",error);
                   }
                  else{
                    console.log("Game insert with id:",result.args);
                    $('div.loaderBack').hide();
                    insertquestion.call(question);
                    AddGameEvent.stopWatching();
                    // Meteor.clearTimeout(errorMsg);
                    }
                });
              }
            });
          
          gSetGame = false;
          Template.map.exitSetGame();
          Session.set("gAreaid","");
          map.closePopup();
          });
        }
        else {
          alert("Please set game in your Area");
        }
    }
   
      if (!gUserName) {
        $('#post').css('display','none');
      }
    $('.notetobeposted').focus();

    // get qr btn
    $('#getqr').click(function(){
     var data = $('.notetobeposted').val();
      var TX = `moac:${global.gContractAddress}?data=${data}&amount=<amount>&token=MOAC`;
      Modal.show('qrModal',{data:TX});
    });
    
    //post note
    $('#post').click(function(){
      
     var noteText = $('.notetobeposted').val();
     var userName = $('.username').val();
     
      // alert(noteText);
      createNoteModal(popup, event.latlng, noteText, userName);
      
    });

    //create user
    $('#createuser').click(function(){
        var userName = $('.username').val();
        console.log('username',userName);
        // alert(noteText);
        createNewUserName(gUserAddress, userName, function(e, c) {

            if(gUserName){
              $('.creatediv').fadeOut(500);
              $('.creatediv').children().fadeOut(500);
              $('#post').fadeIn(500);
            }
          
        });
        // createNoteModal(popup, event.latlng, noteText, userName);
      // $('#post').css('visibility', 'hidden');
    });

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
  var circle_move;
  var circle_drop;
  var circle_pending;
  var cx = null;
  var cy = null;
  var poly_center = [cx,cy];
  

  map.on('mousemove', function(event) {
    var latFloor = Math.floor(event.latlng.lat * 10)/10;
    var latCeil = Math.ceil(event.latlng.lat * 10)/10;
    var lngFloor = Math.floor(event.latlng.lng * 10)/10;
    var lngCeil = Math.ceil(event.latlng.lng * 10)/10;
    cx = (latFloor + latCeil)/2;
    cy = (lngFloor + lngCeil)/2;
    if (tooltip) {
      updateTooltip(event);
    }
    if(poly_center[0]!=cx || poly_center[1]!=cy){
       if(polygon){
        map.removeLayer(polygon);
       }
       var latlngs = [[latFloor, lngFloor],[latFloor, lngCeil],[latCeil, lngCeil],[latCeil, lngFloor]];
       polygon = L.polygon(latlngs, {color: '#0AE0CE',weight: 0.5}).addTo(map);
       poly_center = [cx,cy];
       polygon.bringToBack();
    }
  });

  map.on('mousemove', function(event) {
    if(error_marker){
      map.removeLayer(error_marker);
    }
    if (circle_move){
      map.removeLayer(circle_move);
     }
      circle_move = L.circle([event.latlng.lat,event.latlng.lng],
      {color:'#929292',
      fillColor:'#929292',
      fillOpacity:0.5,
      weight:0.1,
      radius:rad}).addTo(map);

      circle_move.bringToBack();

      if(overlap === true){
        circle_move.setStyle({color:'red',fillColor:'red'});
      }

  })

  // add clustermarkers
  var markers = L.markerClusterGroup(/*{maxClusterRadius:80}*/);
  map.addLayer(markers);

  var query = Markers.find();
  query.observe({
    added: function (document) {
      // map.removeLayer(circle_pending);
      console.log("get note observe");
      circle_drop = L.circle(document.latlng,
           {color:'#13EDDB',
            fillColor:'#13EDDB',
            fillOpacity:0.5,
            weight:0.1,
            radius:rad}).addTo(map);

      circle_drop.on('mouseover',function(event){
        overlap = true;
      })      

      circle_drop.on('mouseout',function(event){
        overlap = false;
      })    
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


var game = games.find();
game.observe({
  added: function(document){
    console.log(document);  
    var myIcon = L.icon({
        iconUrl:'question.png',
        iconSize: [15, 15],
        })

      circle_drop = L.circle(document.latlng,
           {color:'#13EDDB',
            fillColor:'#13EDDB',
            fillOpacity:0.5,
            weight:0.1,
            radius:rad}).addTo(map);

      circle_drop.on('mouseover',function(event){
        overlap = true;
      })      

      circle_drop.on('mouseout',function(event){
        overlap = false;
      })    
    // console.log("add game distribute:",document.distributed);
    L.marker(document.latlng,{icon: myIcon}).addTo(map)
    .bindPopup(document.noteText)
    .on('click', function(event) {
          Modal.show('answerModal',{
            question:document.noteText,
            questionId:document._id, 
            areaid:document.areaid,
            address: chain3js.mc.accounts[0]
          }); 
        }).on('mouseover',function(e){
          this.openPopup();
        }).on('mouseout',function(e){
          this.closePopup();
        });
  }
})
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
  var content = '<div class="notevalue"><div><span class="notelink"><a href="https://google.com"><i class="fas fa-link"></i></a></span><span class="noteuser"> ' + note.name + '  </span><span class="notetime">' + note.displayDate + '</span></div><div class="popupnoteaccount">' + note.address + '</div><hr class="divider"><div class="popupnotetext" style="word-wrap:break-word">' + note.note + '</div><hr class="divider"><div><span class="notecoordinates">lat: ' + note.latlng.lat + '   lng: ' + note.latlng.lng + '</span>';
  if (note.forSell) {
    console.log("note forsell")
    var price = getPrice(note.grid10, true);
    // console.log("popup price", price);
    content += '<br><br><span class="popupforsell">Buy this Note for ' + price + ' MOAC</span>';
  }
  content +='</div></div>';
  if (zoomFlag) {
    map.flyTo([lat, lng], 16,{duration:2});
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

var BidArea;
Template.map.flyToBiddingArea = function(bounds){
  var bound = [[bounds[0].lat,bounds[0].lng],[bounds[1].lat,bounds[1].lng]];
  var lat = parseFloat((bounds[0].lat + bounds[1].lat))/2;
  var lng= parseFloat((bounds[0].lng + bounds[1].lng))/2;
  if (BidArea){
    map.removeLayer(BidArea);
  }
   BidArea = L.rectangle(bound, {color: "black",weight: 0.2}).addTo(map);
   BidArea.bringToBack();
   BidArea.on("mouseover",function(event){
     gInArea = true;
   });

   BidArea.on("mouseout",function(event){
     gInArea = false;
   });
  
   map.flyTo([lat, lng], 13,{duration:2});
}

Template.map.joinGame = function(lat,lng){
   map.flyTo([lat, lng], 15,{duration:2});
}

Template.map.exitSetGame = function(){
  if (BidArea){
    map.removeLayer(BidArea);
  }
}







