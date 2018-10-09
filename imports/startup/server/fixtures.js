import { Meteor } from 'meteor/meteor';
import { Notes } from '../../api/notes/notes.js';
import { Accounts } from '../../api/accounts/accounts.js';

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
  if (Notes.find().count() === 0) {
    const data = [
      {
        address: '0x57d83802a772adf506a89f5021c9',
        latlng: {
          lng: -111.3574,
          lat: 41.4427,
        },
        //grid: 2486440144,
        note: 'my note test1',
        forSell: false,
      },
      {
        address: '0xadf57d83802a772506a89f5034d6',
        latlng: {
          lng: -122.1291,
          lat: 47.3669,
        },
        //grid: 0,
        note: 'my note test2',
        forSell: false,
      },
      {
        address: '0x506a857d83802a7df9f5021c972a',
        latlng: {
          lng: -116.1914,
          lat: 43.4529,
        },
        //grid: 0,
        note: 'my note test3',
        forSell: true,
      },
      {
        address: '0xadf50657d83802a79f5021c972a8',
        latlng: {
          lng: -119.1357,
          lat: 47.1299,
        },
        //grid: 0,
        note: 'I am your President. I like to use Twitter. And, you are fired!',
        forSell: true,
      },
    ];

    var timestamp = (new Date()).getTime();

    data.forEach((note) => {
      Notes.insert({
        address: note.address,
        latlng: note.latlng,
        grid: Math.floor((note.latlng.lat + 360) * 100) * 100000 + Math.floor((note.latlng.lng + 360) * 100),
        grid10: '' + (Math.floor((note.latlng.lat + 360) * 10) * 10000 + Math.floor((note.latlng.lng + 360) * 10)),
        note: note.note,
        forSell: note.forSell,
        createdAt: new Date(timestamp),
        updatedAt: new Date(timestamp),
      });
      timestamp += 10000; // ensure unique timestamp.
    });
  }


  if (Accounts.find().count() === 0) {
    var timestamp = (new Date()).getTime();

    const accountsData = [
      {
        address: '0x57d83802a772adf506a89f5021c9',
        name: 'C Ronaldo'
      },
      {
        address: '0xadf57d83802a772506a89f5034d6',
        name: 'L Messi'
      },
      {
        address: '0x506a857d83802a7df9f5021c972a',
        name: 'Z Zidane'
      },
      {
        address: '0xadf50657d83802a79f5021c972a8',
        name: 'RealDonaldTrump'
      },
    ];

    accountsData.forEach((data) => {
      Accounts.insert(
        {
          address: data.address,
          name: data.name,
          createdAt: new Date(timestamp),
        }
      );
      timestamp += 10000; // ensure unique timestamp.
    });
  }

});