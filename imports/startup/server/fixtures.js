import { Meteor } from 'meteor/meteor';
import {initAccount, initNote,initGame} from './initDBfromChain';
import { Notes } from '../../api/notes/notes.js';
import { Accounts } from '../../api/accounts/accounts.js';
import {Areas} from  '../../api/areas/areas.js'
import {newBidding, insertarea} from '../../api/areas/methods.js';
import {Questions} from  '../../api/questions/questions.js';
import {each} from 'underscore'

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {

  import './observeGameAndArea.js';
  import './Methods';
  
  // initGame();
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

});
