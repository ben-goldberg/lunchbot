'use strict';

const Sequelize = require('sequelize');
const db = require('../lib/db');
const Restaurant = require('./restaurant');

var Visit = db.define('visit', {
  date: { type: Sequelize.DATE },
  restaurantId: { type: Sequelize.INTEGER }
})

Visit.belongsTo(Restaurant, { as: 'restaurant' })

module.exports = Restaurant
