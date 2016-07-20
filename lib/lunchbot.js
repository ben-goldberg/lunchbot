'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var SQLite = require('sqlite3').verbose();
var Bot = require('slackbots');

var LunchBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'lunchbot';
    this.dbPath = settings.dbPath || path.resolve(process.cwd(), 'data', 'lunchbot.db');

    this.user = null;
    this.db = null;
};

LunchBot.prototype.run = function () {
    LunchBot.super_.call(this, this.settings);

    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

LunchBot.prototype._onStart = function () {
    this._loadBotUser();
    this._connectDb();
    console.log('started!');
};

LunchBot.prototype._loadBotUser = function () {
    var self = this;
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
};

LunchBot.prototype._connectDb = function () {
    if (!fs.existsSync(this.dbPath)) {
      fs.openSync(this.dbPath, "w");
      db.serialize(function() {
        db.run("CREATE TABLE restaurant (restuarant_id INTEGER PRIMARY KEY, name TEXT, yelp_url TEXT)");
        db.run("CREATE TABLE visit (visit_id INTEGER PRIMARY KEY, date TEXT, FOREIGN KEY(restuarant_id) REFERENCES restaurant(restuarant_id))");
      });
    }

    this.db = new SQLite.Database(this.dbPath);
};

LunchBot.prototype._onMessage = function (message) {
    if (this._isChatMessage(message) && !this._isFromLunchBot(message)) {
        console.log('message in');
        this._sayHello(message);
        console.log('message out');
    }
};

LunchBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

LunchBot.prototype._isFromLunchBot = function (message) {
    return message.subtype == 'bot_message';
};

LunchBot.prototype._sayHello = function (message) {
    var user = this._getUserById(message.user);
    this.postMessageToUser(user.name, 'Hi to you too, ' + user.real_name + '!');
};

LunchBot.prototype._getUserById = function (id) {
  return this.users.filter(function (user) {
    return user.id === id;
  })[0];
}

// inherits methods and properties from the Bot constructor
util.inherits(LunchBot, Bot);

module.exports = LunchBot;