 import {Template} from 'meteor/templating';
import {Notes} from '../../../imports/api/notes/notes.js';
import {Accounts} from '../../../imports/api/accounts/accounts.js';
import {dateFormat, getPrice} from '../../utils.js';
import MoacConnect from '../../moacconnect.js';
import { type } from 'os';
// import '../../client.js';

var notesLoaded = false;
var accountsLoaded = false;
var hide = false;
Meteor.subscribe('notes', function(){ notesLoaded = true; });
Meteor.subscribe('accounts', function(){ accountsLoaded = true; });

Meteor.startup(function() {
    MoacConnect.InitChain3();
    var filter = chain3js.mc.filter("pending");
    filter.watch(function(e,r){
     if(e){
        console.log("error",e);
        }
     else{
        console.log("new pending",r);
     }
})
});


Template.body.onRendered(function(){
    Meteor.setInterval(function()
    {
        Meteor.setTimeout(function(){
            $('.spot_1').css("opacity","0");
        },0);
        Meteor.setTimeout(function(){
            $('.spot_1').css("opacity","1");
        },800);
        Meteor.setTimeout(function(){
            $('.spot_2').css("opacity","0");
        },200);
        Meteor.setTimeout(function(){
            $('.spot_2').css("opacity","1");
        },1000);
        Meteor.setTimeout(function(){
            $('.spot_3').css("opacity","0");
        },400);
        Meteor.setTimeout(function(){
            $('.spot_3').css("opacity","1");
        },1200);
        Meteor.setTimeout(function(){
            $('.spot_4').css("opacity","0");
        },600);
        Meteor.setTimeout(function(){
            $('.spot_4').css("opacity","1");
        },1400);
        Meteor.setTimeout(function(){
            $('.spot_5').css("opacity","0");
        },800);
        Meteor.setTimeout(function(){
            $('.spot_5').css("opacity","1");
        },1600);
    },2000)
    
    
})

Template.body.events({
'click #drawer'(){
   $('#notes').toggle(700);

   hide = !hide;
   if(hide){
    $('.mapcontainer').css('width','95%');
    // $('.close_ico').css('background','url(drawer_icon.png)');
    $('#drawer').removeClass('close_ico');
    $('#drawer').addClass('draw_icon');
    
   }
   else{
    $('.mapcontainer').css('width','78%');
    // $('.close_ico').css('background','url(close_ico.png)');
    $('#drawer').removeClass('draw_icon');
    $('#drawer').addClass('close_ico');
    
   }
},
})

Template.body.helpers({
    "loadContent"(){
        return Session.get("loadContent");
    }
})

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
        template = Template.instance();
        
        var myNotesSort = TemplateVar.get(template, 'myNotesSort');
        var sortOption = {};
        if (typeof(myNotesSort) === 'undefined' || myNotesSort === 'updatedAt')
        {
            sortOption = {sort: {updatedAt: -1}};
        }

        var query = Notes.find({}, sortOption);
        var notes = query.fetch();
        notes.forEach(function(n) {
            var q = {address: n.address};
            var account = Accounts.find(q).fetch();
            n.displayDate = dateFormat(n.updatedAt);
            if (account.length > 0) {
                n.name = account[0].name;
            }
            console.log("getnotes from views");
            n.price = getPrice(n.grid10, true)
            if (n.forSell) {
                n.forSellInfo = n.price;
            }
        });

        if (typeof(myNotesSort) !== 'undefined' && myNotesSort === 'price')
        {
            notes = notes.sort(function(a, b){
                return b.price-a.price;
            });
        }
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
        console.log('getNotes 2', notes);
        return notes;
    },
});

Template.notesbody.onCreated(function(){
    var template = Template.instance();
    TemplateVar.set(template, 'latestViewClick', true);
    TemplateVar.set(template, 'hottestViewClick', false);
});

Template.notesbody.events({
    'click .latestView': function(e){
        var template = Template.instance();
        TemplateVar.set(template, 'myNotesSort', 'updatedAt');
        TemplateVar.set(template, 'latestViewClick', true);
        TemplateVar.set(template, 'hottestViewClick', false);
    },
    'click .hottestView': function(e){
        var template = Template.instance();

        TemplateVar.set(template, 'myNotesSort', 'price');
        TemplateVar.set(template, 'latestViewClick', false);
        TemplateVar.set(template, 'hottestViewClick', true);
    },
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
    'click .notecoordinates': function(e) {
        var lat = parseFloat($(e.target).data('lat'));
        var lng = parseFloat($(e.target).data('lng'));
        var noteid = $(e.target).data('noteid');
        // console.log('click .notecoordinates', lat, lng);
        var zoomFlag = true;
        Template.map.moveto(lat, lng, noteid, zoomFlag);
    },
    'click .notetext': function(e) {
        var lat = parseFloat($(e.target).data('lat'));
        var lng = parseFloat($(e.target).data('lng'));
        var noteid = $(e.target).data('noteid');
        // console.log('click .notecoordinates', lat, lng);
        var zoomFlag = true;
        Template.map.moveto(lat, lng, noteid, zoomFlag);
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

Template.header.onCreated(function(){
    var template = this;
    TemplateVar.set(template, 'headline', 'Retrieving Jackpot........');

    Meteor.setInterval(()=>{
        try
        {
            MoacConnect.GetJackpot(function(e,c) {
                if(!e && c.toString != '')
                {   
                    var jcpt = c.toNumber()/1e18;
                    TemplateVar.set(template, 'headline', jcpt.toString() + ' MOAC');
                }
                else
                {   
                    TemplateVar.set(template, 'headline', TAPi18n.__("app.NoJackpotInfo"));
                    
                }
            });
        }
        catch(e)
        {
            TemplateVar.set(template, 'headline', TAPi18n.__("app.NoJackpotInfo"));
        }}, 5000);
});

Template.map.onRendered(function (){
     Meteor.setInterval(()=>{
        
     if($(document).scrollTop() > 20){
       $('.header').css('height','10px');
       $('.header').children().hide();
     }
     else{
        $('.header').css('height','60px');
        $('.header').children().show(300);
     }
    },400);

});

Template.map.helpers({
    'slideContent'(){
        return Session.get('slideOption');
    }
})

Template.map.events({
    'mouseover .notes'(){
        $('.close_ico').css('opacity','1');
    },
    'mouseover .close_ico'(){
        $('.close_ico').css('opacity','1');
    },
    'mouseleave .close_ico'(){
        $('.close_ico').css('opacity','0');
    },
    'mouseleave .notes'(){
        $('.close_ico').css('opacity','0');
    },
    // 'click .exiticon'(e){
    //     gSetGame = false;
    //      $(".exiticon").css('visibility','hidden');
    //     Template.map.exitSetGame();
    //     Session.set("gAreaid","");
    // }

})

Template.header.helpers({
    'balance'(){
        // var template = Template.instance();
        chain3js.mc.getBalance(chain3js.mc.coinbase,function(e,r){
            if(e){
                console.log(e);
            }
            else{
                var balance = r.toNumber()/1e18;
                // TemplateVar.set(template,'balance',balance.toFixed(3));
                Session.set('balance',balance);
            }
        });

        if(Session.get('balance') - 0.0005 <= 0) return "0.000";
        return (Session.get('balance') - 0.0005).toFixed(3);
    }
    
});

Template.header.events({
    // 'click #nav'(){
    //     $('div.slideOption').toggleClass('showSlide');
    // }
});

Template.slideOption.onCreated(function(){
    Session.set('slideOption',"notesbody");
})

Template.slideOption.helpers({
    'slideOption'(select){
        var cruOption = Session.get('slideOption');
        return (select == cruOption) && 'selected';
    }
})

Template.slideOption.events({
    'click .slideNote'(){
        Session.set('slideOption',"notesbody");
    },
    'click .slideBidding'(){
        Session.set('slideOption',"areainfobody");
    },
    'click .slideGame'(){
        Session.set('slideOption',"gamebody");
    }
})