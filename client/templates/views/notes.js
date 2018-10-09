var myContract;

Template.notesbody.helpers({
    notes:[
        {
            notelink: "https://google.com"
            ,notetext: "This is the center of the Universe."
            ,notetime: "2018/10/14 15:00 UTC"
            ,noteuser: "C Ronaldo"
            ,noteaccount: "0xbc84fbf220e0301ae032d315eccd00c29838687d"
            ,notelat: "45.0703"
            ,notelng: "7.6869"
            ,isForSell: false
            ,noteforsellinfo: "Price: 1.25MC"
            ,noteid: 111
        }
        ,{
            notelink: "https://google.com"
            ,notetext: "This is the center of the Catalonia."
            ,notetime: "2018/10/14 15:00 UTC"
            ,noteuser: "L Messi"
            ,noteaccount: "0x2a24ed9b55112201cb46a55defac682099885058"
            ,notelat: "41.3851"
            ,notelng: "2.1734"
            ,isForSell: true
            ,noteforsellinfo: "Price: 1.36MC"
            ,noteid: 12
        }
    ],
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
    }
});

Template.note.helpers({
    'localTime': function(inputDate){
        var nd = new Date(inputDate.replace(/-/g, "/"));
        return nd.toLocaleDateString() +' '+ nd.toLocaleTimeString();
    },
    'contribution': function(paramJson) {
        paramJson = paramJson.hash;
        var result = paramJson.result;
        var gameNumber = paramJson.gameNumber;

        if (!contractInstance && (typeof chain3 !== 'undefined')) {
            contractInstance = chain3.mc.contract(contractAbi).at(contractAddress);
        }

        if (contractInstance) {
            var match = contractInstance.matches(gameNumber);
            var index = 9;
            if (result == 1) {
                index = 11;
            } else if (result == 2) {
                index = 10;
            }
            return Math.floor(match[index]/1000000000000000000 + 0.5)+ ' WCT';
        } else {
            return "";
        }
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

