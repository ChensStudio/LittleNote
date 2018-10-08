import { Meteor } from 'meteor/meteor';
import { Notes } from '../../api/notes/notes.js';

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
  if (Notes.find().count() === 0) {
    const data = [
      {
        address: '0x57d83802a772adf506a89f5021c9',
        location: {
            longtitude: -111.357421875,
            latitude: 41.4427263776721,
        },
        //grid: 2486440144,
        note: 'my note test1',
        forSell: false,
      },
      {
        address: '0xadf57d83802a772506a89f5034d6',
        location: {
            longtitude: -122.129173278809,
            latitude: 47.3669666422258,
        },
        //grid: 0,
        note: 'my note test2',
        forSell: false,
      },
      {
        address: '0x506a857d83802a7df9f5021c972a',
        location: {
            longtitude: -116.19140625,
            latitude: 43.4529188935547,
        },
        //grid: 0,
        note: 'my note test3',
        forSell: true,
      },
      {
        address: '0xadf50657d83802a79f5021c972a8',
        location: {
            longtitude: -119.1357421875,
            latitude: 47.1299507566631,
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
                location: note.location,
                grid: Math.floor(note.location.longtitude + 360) * 100 * 100000 + Math.floor(note.location.latitude + 360) * 100,
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