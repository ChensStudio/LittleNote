import {Notes} from '../../../imports/api/notes/notes.js';
import {Accounts} from '../../../imports/api/accounts/accounts.js';
var myContract;

var ONE_MINUTE = 60 * 1000;
var ONE_HOUR = 60 * ONE_MINUTE;
var ONE_DAY = 24 * ONE_HOUR;
var ONE_WEEK = 7 * ONE_DAY;
var DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var MONTHS = ['Jan.','Feb.','Mar.','Apr.','May','June','July','Aug.','Sep.','Oct.','Nov.','Dec.'];

var dateFormat = function(d) {
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


var PRICE = [0.05,'Feb.','Mar.','Apr.','May','June','July','Aug.','Sep.','Oct.','Nov.','Dec.'];

var getPrice = function(grid10, selfFlag) {
    var count = Notes.find({grid10: grid10}).count();
    if (!selfFlag) {
        count++;
    }
    if (count == 0) {
        return 0;
    }
    var price = Math.floor(0.05 * Math.pow(1.35, count) * 100 + 0.5)/100;
    return price;
}

Template.notesbody.helpers({
    // notes:[
    //     {
    //         notelink: "https://google.com"
    //         ,notetext: "This is the center of the Universe."
    //         ,notetime: "2018/10/14 15:00 UTC"
    //         ,noteuser: "C Ronaldo"
    //         ,noteaccount: "0xbc84fbf220e0301ae032d315eccd00c29838687d"
    //         ,notelat: "45.0703"
    //         ,notelng: "7.6869"
    //         ,isForSell: false
    //         ,noteforsellinfo: "Price: 1.25MC"
    //         ,noteid: 111
    //     }
    //     ,{
    //         notelink: "https://google.com"
    //         ,notetext: "This is the center of the Catalonia."
    //         ,notetime: "2018/10/14 15:00 UTC"
    //         ,noteuser: "L Messi"
    //         ,noteaccount: "0x2a24ed9b55112201cb46a55defac682099885058"
    //         ,notelat: "41.3851"
    //         ,notelng: "2.1734"
    //         ,isForSell: true
    //         ,noteforsellinfo: "Price: 1.36MC"
    //         ,noteid: 12
    //     }
    // ],
    'notes': function() {
        var query = Notes.find({});
        var notes = query.fetch();
        notes.forEach(function(n) {
            var q = {address: n.address};
            var account = Accounts.find(q).fetch();
            n.displayDate = dateFormat(n.updatedAt);
            if (account.length > 0) {
                n.name = account[0].name;
            }
            n.price = getPrice(n.grid10, true)
            if (n.forSell) {
                n.forSellInfo = 'Price: ' + n.price + 'MC';
            }
        });
        console.log('getNotes', notes);
        return notes;
    },
    'isMicroMessage': function () {
        var ua = window.navigator.userAgent.toLowerCase();
        console.log(ua);
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            return true;
        }
        else {
            return false;
        }
    },
    'isAndroid': function () {
        var ua = window.navigator.userAgent.toLowerCase();
        console.log(ua);
        if(ua.match(/android/i) == 'android'){
            return true;
        }
        else {
            return false;
        }
    },
    'isApple': function () {
        var ua = window.navigator.userAgent.toLowerCase();
        console.log(ua);
        if(ua.match(/iphone/i) == 'iphone'){
            return true;
        }
        else {
            return false;
        }
    },
    'getNotes': function() {
        var query = Notes.find({});
        var notes = query.fetch();
        console.log('getNotes', notes);
        return notes;
    }
});

Template.note.helpers({
    'localTime': function(inputDate){
        var nd = new Date(inputDate.replace(/-/g, "/"));
        return nd.toLocaleDateString() +' '+ nd.toLocaleTimeString();
    },
    'jackpot': function(gameNumber) {

        if (!contractInstance && (typeof chain3 !== 'undefined')) {
            contractInstance = chain3.mc.contract(contractAbi).at(contractAddress);
        }

        if (contractInstance) {
            var match = contractInstance.matches(gameNumber);
            var index = 8;
            return Math.floor(match[index]/1000000000000000000 + 0.5)+ ' WCT';
        } else {
            return "";
        }
    },
    'betTokenBalances': function() {

    },
    'isShowButton': function(inputTime){
        var currentTimeStamp = new Date().getTime();
        var gameTimeStamp = new Date(inputTime).getTime();

        if(currentTimeStamp >= gameTimeStamp) {
            return false;
        } 
        return true;
    },
    'isShowDraw': function(gameNumber){
        if(gameNumber>48){
            return false;
        }
        return true;
    }
});

Template.note.events({
    'click .forsell': function(e) {
        myContract = $(e.target).data('contract');
        // myContract = e.target.dataset.contract;
        Modal.show('qrModal');
    },
    'click .notecoordinates': function(e) {
        var lat = parseFloat($(e.target).data('lat'));
        var lng = parseFloat($(e.target).data('lng'));
        var noteid = $(e.target).data('noteid');
        console.log('click .notecoordinates', lat, lng);
        Template.map.moveto(lat, lng, noteid);
    },
    // ,
    // 'click .notevalue': function(e) {
    //     var lat = parseFloat($(e.target).data('lat'));
    //     var lng = parseFloat($(e.target).data('lng'));
    //     var noteid = $(e.target).data('noteid');
    //     console.log('click .notecontainer', lat, lng, noteid);
    //     Template.map.move(lat, lng, noteid);
    // }

 });

Template.qrModal.helpers({
    contract: function(){
        return myContract;
    },
    tx: function(){
        return "moac:"+myContract+"?amount=1.000000&token=MOAC";
    },
    clipboard: function(){
        var clipboard = new Clipboard('.btn');
    }
});

