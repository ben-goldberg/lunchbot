'use strict';

class ActionDispatcher {

  constructor(tokens, machine) {
    this.action = tokens.action;
    this.data = tokens.data;
    this.model = tokens.model;
    this.machine = machine;
  }

  dispatch() {
    if (this.action === 'collecting') {
      return
    }
    if (this.action in this.model) {
      this.model.sync().then(() => this.model[this.action](this.data));
      let outMessage = this.machine.outMessage;
      this.machine.next();
      return outMessage;
    }
    throw new Error(`${this.action} is not defined for ${this.model}`);
  }

}

module.exports = ActionDispatcher;
