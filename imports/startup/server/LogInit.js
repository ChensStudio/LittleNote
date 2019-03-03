const log4js = require('log4js');
var path = require('path');
Meteor.rootPath     = path.resolve('.');
Meteor.rootPath  =  Meteor.rootPath.split(path.sep + '.meteor')[0];

log4js.configure({
  appenders: { Jackpot: { type: 'file', filename: Meteor.rootPath + path.sep +'LOGS' + path.sep + 'JackpotDistribute.log' } },
  categories: { default: { appenders: ['Jackpot'], level: 'info' } }
});

export const Jackpotlogger = log4js.getLogger('Jackpot');