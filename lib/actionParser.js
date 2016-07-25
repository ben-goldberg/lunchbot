'use strict';

const initialMachine = require('../machines/initialMachine');

class ActionParser {

  constructor(message, machine) {
    this.message = message.text;
    this.machine = machine || initialMachine;
  }

  parse() {
    let tokens = this.machine.parse(this.message);
    return tokens
  }

}

module.exports = ActionParser;
