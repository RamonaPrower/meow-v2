// commands
const speak = require('./commands/speak.js');

module.exports.commands = [speak];

// admin
const toggle = require('./admin/toggle.js');

module.exports.admin = [toggle];