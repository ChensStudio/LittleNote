import { Meteor } from 'meteor/meteor';
import { Notes } from '../../api/notes/notes.js';

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
  if (Notes.find().count() === 0) {
    const data = [
      {
        address: '0x57d83802a772adf506a89f5021c9',
        latlng: {
            lng: -111.357421875,
            lat: 41.4427263776721,
        },
        //grid: 2486440144,
        note: 'my note test1',
        forSell: false,
      },
      {
        address: '0xadf57d83802a772506a89f5034d6',
        latlng: {
            lng: -122.129173278809,
            lat: 47.3669666422258,
        },
        //grid: 0,
        note: 'my note test2',
        forSell: false,
      },
      {
        address: '0x506a857d83802a7df9f5021c972a',
        latlng: {
            lng: -116.19140625,
            lat: 43.4529188935547,
        },
        //grid: 0,
        note: 'my note test3',
        forSell: true,
      },
      {
        address: '0xadf50657d83802a79f5021c972a8',
        latlng: {
            lng: -119.1357421875,
            lat: 47.1299507566631,
        },
        //grid: 0,
        note: 'my note test4',
        forSell: true,
      },
    ];

    let timestamp = (new Date()).getTime();

    data.forEach((note) => {
        Notes.insert(
            {
                address: note.address,
                latlng: note.latlng,
                grid: Math.floor(note.latlng.lng + 360) * 100 * 100000 + Math.floor(note.latlng.lat + 360) * 100,
                note: note.note,
                forSell: note.forSell,
                createdAt: new Date(timestamp),
                updatedAt: new Date(timestamp),
            }
        );
        timestamp += 1; // ensure unique timestamp.
      });
    }
});