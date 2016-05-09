var SlackBot = require('slackbots');

var lunchbot = new SlackBot({
    token: process.env.BOT_API_KEY,
    name: 'Lunchbot'
});

function getUserById(bot, id) {
  return bot.users.filter(function(user) {
    return user.id === id;
  })[0]
}

lunchbot.on('start', function() {
  console.log('starting up!')
});

lunchbot.on('message', function(data) {
  if(data.type == 'message' && data.subtype != 'bot_message') {
    console.log(data)
    var user = getUserById(lunchbot, data.user);
    lunchbot.postMessageToUser(user.name, 'Hello to you too!');
  }
});
