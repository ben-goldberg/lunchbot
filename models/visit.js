const Sequelize = require('sequelize');
const db = require('../lib/db');
const Restaurant = require('./restaurant');

const Visit = db.define('visit', {
  date: { type: Sequelize.DATE },
  restaurantId: { type: Sequelize.INTEGER },
}, {
  tableName: 'visits',
  instanceMethods: {
    toSlackString: function toSlackString() {
      return ['Visit',
              `    date: ${this.date}`,
              `    restaurant: ${this.restaurant().name}`].join('\n');
    },
    restaurant: () => Restaurant.findById(this.restaurantId).then(restaurant => restaurant),
  },
});

// eslint-disable-next-line no-underscore-dangle
Visit._create = function _create(data) {
  return Visit.create(data).then(visit => visit.toSlackString());
};

Visit.belongsTo(Restaurant, { as: 'restaurant' });

module.exports = Visit;
