// basic info
App.info({
  name: 'littlenote',
  description: 'A littlenote on MOAC chain',
  author: '',
  email: '',
  website: 'http://littlenote.io'
});

// CORS for Meteor app
App.accessRule('meteor.local/*');
// allow tiles
App.accessRule('*.openstreetmap.org/*');
App.accessRule('stamen-tiles-a.a.ssl.fastly.net/*');
App.accessRule('stamen-tiles-b.a.ssl.fastly.net/*');
App.accessRule('stamen-tiles-c.a.ssl.fastly.net/*');
App.accessRule('stamen-tiles-d.a.ssl.fastly.net/*');
