'use strict';

const Restaurant = require('../models/restaurant');
const Visit = require('../models/visit');

class ActionParser {

  constructor(message) {
    this.message = message.text;
    this.classHash = {
      restaurant: Restaurant,
      visit: Visit,
    };
  }

  parse() {
    return {
      action: this.getAction(),
      clazz: this.getClass(this.classToken()),
      data: this.getData(),
    };
  }

  getAction() {
    const actions = ['create'];
    const action = actions.filter(act => this.message.includes(act))[0];
    return `_${action}`;
  }

  getData() {
    const start = this.message.indexOf('{');
    const end = this.message.indexOf('}');
    const jsonMessage = this.message.slice(start, end + 1);
    try {
      return JSON.parse(jsonMessage);
    } catch (err) {
      throw new Error(`Invalid JSON: ${err}`);
    }
  }

  getClass(classToken) {
    const clazz = this.classHash[classToken];
    if (clazz === undefined) {
      throw new Error('Undefined class');
    } else {
      return clazz;
    }
  }

  classToken() {
    const classes = Object.keys(this.classHash);
    return classes.filter(clazz => this.message.includes(clazz))[0];
  }

}

module.exports = ActionParser;
