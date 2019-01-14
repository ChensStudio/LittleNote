import { Meteor } from 'meteor/meteor';
import {initAccount, initNote} from './initDBfromChain';
import { Notes } from '../../api/notes/notes.js';
import { Accounts } from '../../api/accounts/accounts.js';
import {Areas} from  '../../api/areas/areas.js'
import {newBidding, insertarea} from '../../api/areas/methods.js';

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
  if (Accounts.find().count() === 0) {
    var timestamp = (new Date()).getTime();
    let accountsData = initAccount();

    accountsData.forEach((data) => {
      console.log(data);
      Accounts.insert(
        {
          address: data.address,
          name: data.name,
          noteCounts: data.noteCounts,
          onChainFlag: false,
          createdAt: new Date(timestamp),
        }
      );
      timestamp += 10000; // ensure unique timestamp.
    });
  }

  if (Notes.find().count() === 0) {

    var timestamp = (new Date()).getTime();
    let notesData = initNote();

    notesData.forEach((note) => {
     console.log(note);
      Notes.insert({
        address: note.address,
        latlng: note.latlng,
        grid: Math.floor((note.latlng.lat + 360) * 100) * 100000 + Math.floor((note.latlng.lng + 360) * 100),
        grid10: '' + (Math.floor((note.latlng.lat + 360) * 10) * 10000 + Math.floor((note.latlng.lng + 360) * 10)),
        note: note.note,
        forSell: note.forSell,
        onChainFlag: false,
        createdAt: new Date(timestamp),
        updatedAt: new Date(timestamp),
      });
      timestamp += 10000; // ensure unique timestamp.
    });
  }

// var bound = [{lat:40.712,lng:-74.227},{lat:40.774,lng:74.125}];

//  var AreaInsert = {
//     admin:"0x6457ec6E7F12b0dED0F0616202434970103FcB83",
//     // bounds:bound,
//     highestBidding:5,
//     // history:[{_id:"12312dssaasd",
//     //             bidder: "0x6457ec6E7F12b0dED0F0616202434970103FcB83",
//     //             updatedAt:new Date()}],
//     startTime:new Date(),
//     endTime:new Date(new Date().getTime() + 1000*60*60)
//   }
//   console.log(AreaInsert.startTime);
//   console.log(AreaInsert.endTime);

//   insertarea.call(AreaInsert);
  

  // newBidding.call({'ngyWNzFet3xhsY8MS',6,'0x4657ec6E7F12b0dED0F0616202434970103FcB83'});
});