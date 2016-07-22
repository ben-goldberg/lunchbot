'use strict';

const util = require('util');
const path = require('path');
const fs = require('fs');
const SQLite = require('sqlite3').verbose();
const Bot = require('slackbots');
const db = require('./db');
const ActionParser = require('./actionParser');
const ActionDispatcher = require('./actionDispatcher');

class LunchBot extends Bot {

  constructor(settings) {
    super(settings);
    this.settings = settings;
    this.settings.name = settings.name || 'lunchbot';
    this.dbPath = settings.dbPath || path.resolve(process.cwd(), 'data', 'lunchbot.db');
    this.user = null;
    this.db = null;
  }

  run() {
    this.on('start', this._onStart);
    this.on('message', this._onMessage);
  }

  _onStart() {
    this._loadBotUser();
    this._connectDb();
    console.log('started!');
  }

  _loadBotUser() {
    this.user = this.users.filter(user => user.name === this.name)[0];
  }

  _connectDb() {
    db.authenticate()
      .then(err => console.log('Successfully connected to DB'))
      .catch(err => console.log('Unable to connect to DB:', err));
  }

  _onMessage(message) {
    if (this._isChatMessage(message) && !this._isFromLunchBot(message)) {
      let tokens = new ActionParser(message).parse();
      new ActionDispatcher(tokens)
        .dispatch()
        .then(return_message => this._sendReturnMessage(message, return_message));
    }
  }

  _isChatMessage(message) {
    return message.type === 'message' && Boolean(message.text);
  }

  _isFromLunchBot(message) {
    return message.subtype == 'bot_message';
  }

  _sendReturnMessage(inMessage, outMessage) {
    let user = this._getUserById(inMessage.user);
    this.postMessageToUser(user.name, outMessage);
  }

  _getUserById(id) {
    return this.users.filter(user => user.id === id)[0];
  }

}

module.exports = LunchBot;
