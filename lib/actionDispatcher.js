'use strict';

class ActionDispatcher {

  constructor(tokens) {
    this.action = tokens.action;
    this.data = tokens.data;
    this.clazz = tokens.clazz;
  }

  dispatch () {
    if (this.action in this.clazz) {
      return this.clazz.sync().then( () => {
        return this.clazz[this.action](this.data);
      })
    } else {
      throw(`${this.action} is not defined for ${this.clazz}`)
    }
  }

}

module.exports = ActionDispatcher;
