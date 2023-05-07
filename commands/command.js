// commands
const bazinga = require('./commands/bazinga.js');
const feed = require('./commands/feed.js');
const hello = require('./commands/hello.js');
const hug = require('./commands/hug.js');
const hunger = require('./commands/hunger.js');
const speak = require('./commands/speak.js');

module.exports.commands = [bazinga, feed, hello, hug, hunger, speak];

// admin
const toggle = require('./admin/toggle.js');

module.exports.admin = [toggle];