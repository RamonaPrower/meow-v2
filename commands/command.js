// commands
const bazinga = require('./commands/bazinga.js');
const feed = require('./commands/feed.js');
const hello = require('./commands/hello.js');
const speak = require('./commands/speak.js');

module.exports.commands = [bazinga, feed, hello, speak];

// admin
const toggle = require('./admin/toggle.js');

module.exports.admin = [toggle];