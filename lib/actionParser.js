'use strict';

const Restaurant = require('../models/restaurant');
const Visit = require('../models/visit');

class ActionParser {

  constructor(message) {
    this.message = message.text;
  }

  parse () {
    let action = this._getAction()
    let data = this._getData()
    let clazz = this._getClass(this._classToken());
    return { action: action, clazz: clazz, data: data };
  }

  _getAction () {
    let actions = ['create'];
    return actions.filter((action) => this.message.includes(action))[0];
  }

  _getData () {
    let start = this.message.indexOf('{');
    let end = this.message.indexOf('}');
    let json_message = this.message.slice(start, end+1);
    try {
      console.log(json_message);
      return JSON.parse(json_message);
    } catch(err) {
      throw(`Invalid JSON: ${err}`);
    }
  }

  _getClass (class_token) {
    let clazz = this._classHash()[class_token]
    if (typeof clazz == 'undefined') {
      throw('Undefined class');
    } else {
      return clazz;
    }
  }

  _classToken () {
    let classes = Object.keys(this._classHash());
    return classes.filter((clazz) => this.message.includes(clazz))[0];
  }

  _classHash () {
    return {
      'restaurant': Restaurant,
      'visit': Visit
    };
  }
}

module.exports = ActionParser;
