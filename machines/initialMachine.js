const machina = require('machina');

var initialMachine = new machine.Fsm( {
  initialState: 'waiting',
  states: {
    waiting: {
      parse: function(message) {
        const model = ['restaurant', 'visit'].filter(mod => message.includes(mod))[0];
        return { model: model, action: 'collecting' }
      }
    }
  }
})

module.exports = initialMachine;
