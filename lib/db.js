'use strict';

const Sequelize = require('sequelize');

module.exports = new Sequelize(
  'database',
  null,
  null,
  {
    dialect: 'sqlite',
    storage: 'data/lunchbot.sqlite',
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  }
);
