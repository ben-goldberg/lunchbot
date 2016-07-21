'use strict';

const util = require('util');
const path = require('path');
const fs = require('fs');
const SQLite = require('sqlite3').verbose();
const Bot = require('slackbots');
const db = require('./db');
const ActionParser = require('./actionParser');

class LunchBot extends Bot {

  constructor(settings) {
    super(settings);
    this.settings = settings;
    this.settings.name = this.settings.name || 'lunchbot';
    this.dbPath = settings.dbPath || path.resolve(process.cwd(), 'data', 'lunchbot.db');
    this.user = null;
    this.db = null;
  }

  run () {
    this.on('start', this._onStart);
    this.on('message', this._onMessage);
  }

  _onStart () {
    this._loadBotUser();
    this._connectDb();
    console.log('started!');
  }

  _loadBotUser () {
    this.user = this.users.filter((user) => user.name === this.name)[0];
  }

  _connectDb () {
    db.authenticate()
      .then(function (err) {
        console.log('Successfully connected to DB');
      })
      .catch(function (err) {
        console.log('Unable to connect to DB:', err);
      });
  }

  _onMessage (message) {
    if (this._isChatMessage(message) && !this._isFromLunchBot(message)) {
      let tokens = new ActionParser(message).parse()
      console.log(tokens)
    }
  }

  _isChatMessage (message) {
    return message.type === 'message' && Boolean(message.text);
  }

  _isFromLunchBot (message) {
    return message.subtype == 'bot_message';
  }

  _sayHello (message) {
    let user = this._getUserById(message.user);
    this.postMessageToUser(user.name, `Hi to you too, ${user.real_name}!`);
  }

  _getUserById (id) {
    return this.users.filter(function (user) {
      return user.id === id;
    })[0];
  }

}

module.exports = LunchBot;
