'use strict';

const Sequelize = require('sequelize');
const db = require('../lib/db');
const Restaurant = require('./restaurant');

var Visit = db.define('visit', {
  date: { type: Sequelize.DATE },
  restaurantId: { type: Sequelize.INTEGER }
}, {
  tableName: 'visits',
  instanceMethods: {
    toSlackString: function() {
      return ['Visit',
              `  date: ${this.date}`,
              `  restaurant: ${this.restaurant().name}`].join('\n');
    },
    restaurant: function() {
      return Restaurant.findById(this.restaurantId).then(function(restaurant) {
        return restaurant;
      })
    }
  }
})

Visit._create = function (data) {
  return Visit.create(data).then( function(visit) {
    return visit.toSlackString();
  })
}

Visit.belongsTo(Restaurant, { as: 'restaurant' })

module.exports = Visit
