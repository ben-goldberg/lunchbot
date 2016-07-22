'use strict';

const Sequelize = require('sequelize');
const db = require('../lib/db');

var Restaurant = db.define('restaurant', {
  name: { type: Sequelize.STRING },
  rating: { type: Sequelize.INTEGER },
  yelp_url: { type: Sequelize.STRING }
}, {
  tableName: 'restaurants',
  instanceMethods: {
    toSlackString: function() {
      return ['Restaurant',
              `  name: ${this.name}`,
              `  rating: ${this.rating}`,
              `  yelp_url: ${this.yelp_url}`].join('\n');
    }
  }
});

Restaurant._create = function (data) {
  return Restaurant.create(data).then( function(restaurant) {
    return restaurant.toSlackString();
  })
}

module.exports = Restaurant;
