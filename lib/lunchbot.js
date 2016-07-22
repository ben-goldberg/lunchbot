'use strict';

const path = require('path');
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
    this.on('start', this.onStart);
    this.on('message', this.onMessage);
  }

  onStart() {
    this.loadBotUser();
    this.connectDb();
    console.log('started!');
  }

  loadBotUser() {
    this.user = this.users.filter(user => user.name === this.name)[0];
  }

  connectDb() {
    db.authenticate()
      .then(() => console.log('Successfully connected to DB'))
      .catch(err => console.log('Unable to connect to DB:', err));
  }

  onMessage(message) {
    if (this.isChatMessage(message) && !this.isFromLunchBot(message)) {
      const tokens = new ActionParser(message).parse();
      new ActionDispatcher(tokens)
        .dispatch()
        .then(returnMessage => this.sendReturnMessage(message, returnMessage));
    }
  }

  isChatMessage(message) {
    return message.type === 'message' && Boolean(message.text);
  }

  isFromLunchBot(message) {
    return message.subtype === 'bot_message';
  }

  sendReturnMessage(inMessage, outMessage) {
    const user = this.getUserById(inMessage.user);
    this.postMessageToUser(user.name, outMessage);
  }

  getUserById(id) {
    return this.users.filter(user => user.id === id)[0];
  }

}

module.exports = LunchBot;
