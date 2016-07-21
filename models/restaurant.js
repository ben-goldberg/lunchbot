'use strict';

const Sequelize = require('sequelize');
const db = require('../lib/db');

var Restaurant = db.define('restaurant', {
  name: { type: Sequelize.STRING },
  rating: { type: Sequelize.INTEGER },
  yelp_url: { type: Sequelize.STRING }
})

module.exports = Restaurant;
