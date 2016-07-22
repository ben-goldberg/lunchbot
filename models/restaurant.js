const Sequelize = require('sequelize');
const db = require('../lib/db');

const Restaurant = db.define('restaurant', {
  name: { type: Sequelize.STRING },
  rating: { type: Sequelize.INTEGER },
  yelp_url: { type: Sequelize.STRING },
}, {
  tableName: 'restaurants',
  instanceMethods: {
    toSlackString: function toSlackString() {
      return ['Restaurant',
              `  name: ${this.name}`,
              `  rating: ${this.rating}`,
              `  yelp_url: ${this.yelp_url}`].join('\n');
    },
  },
});

// eslint-disable-next-line no-underscore-dangle
Restaurant._create = function _create(data) {
  return Restaurant.create(data).then(restaurant => restaurant.toSlackString());
};

module.exports = Restaurant;
