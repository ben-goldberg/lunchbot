'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var SQLite = require('sqlite3').verbose();
var Bot = require('slackbots');

class LunchBot {

  constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'lunchbot';
    this.dbPath = settings.dbPath || path.resolve(process.cwd(), 'data', 'lunchbot.db');
    this.user = null;
    this.db = null;
  }

  run () {
    LunchBot.super_.call(this, this.settings);

    this.on('start', this._onStart);
    this.on('message', this._onMessage);
  }

  _onStart () {
    this._loadBotUser();
    this._connectDb();
    console.log('started!');
  }

  _loadBotUser () {
      var self = this;
      this.user = this.users.filter(function (user) {
          return user.name === self.name;
      })[0];
  }

  _connectDb () {
      if (!fs.existsSync(this.dbPath)) {
        fs.openSync(this.dbPath, "w");
        db.serialize(function() {
          db.run("CREATE TABLE restaurant (restuarant_id INTEGER PRIMARY KEY, name TEXT, yelp_url TEXT)");
          db.run("CREATE TABLE visit (visit_id INTEGER PRIMARY KEY, date TEXT, FOREIGN KEY(restuarant_id) REFERENCES restaurant(restuarant_id))");
        });
      }

      this.db = new SQLite.Database(this.dbPath);
  }

  _onMessage (message) {
      if (this._isChatMessage(message) && !this._isFromLunchBot(message)) {
          this._sayHello(message);
      }
  }

  _isChatMessage (message) {
      return message.type === 'message' && Boolean(message.text);
  }

  _isFromLunchBot (message) {
      return message.subtype == 'bot_message';
  }

  _sayHello (message) {
      var user = this._getUserById(message.user);
      this.postMessageToUser(user.name, 'Hi to you too, ' + user.real_name + '!');
  }

  _getUserById (id) {
    return this.users.filter(function (user) {
      return user.id === id;
    })[0];
  }

}

// inherits methods and properties from the Bot constructor
util.inherits(LunchBot, Bot);

module.exports = LunchBot;