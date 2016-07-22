'use strict';

const Restaurant = require('../models/restaurant');
const Visit = require('../models/visit');

class ActionParser {

  constructor(message) {
    this.message = message.text;
    this.classHash = {
      restaurant: Restaurant,
      visit: Visit
    };
  }

  parse() {
    return { 
      action: this._getAction(),
      clazz: this._getClass(this._classToken()),
      data: this._getData()
    };
  }

  _getAction() {
    const actions = ['create'];
    let action = actions.filter(action => this.message.includes(action))[0];
    return `_${action}`
  }

  _getData() {
    let start = this.message.indexOf('{');
    let end = this.message.indexOf('}');
    let json_message = this.message.slice(start, end + 1);
    try {
      return JSON.parse(json_message);
    } catch(err) {
      throw(`Invalid JSON: ${err}`);
    }
  }

  _getClass(class_token) {
    let clazz = this.classHash[class_token]
    if (clazz === undefined) {
      throw('Undefined class');
    } else {
      return clazz;
    }
  }

  _classToken() {
    let classes = Object.keys(this.classHash);
    return classes.filter(clazz => this.message.includes(clazz))[0];
  }

}

module.exports = ActionParser;
