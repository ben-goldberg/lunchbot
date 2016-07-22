'use strict';

const LunchBot = require('../lib/lunchbot');

const token = process.env.BOT_API_KEY;
const dbPath = process.env.BOT_DB_PATH;
const name = process.env.BOT_NAME;

const lunchbot = new LunchBot({
  token: token,
  dbPath: dbPath,
  name: name,
});

lunchbot.run();
