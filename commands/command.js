// commands
const bazinga = require('./commands/bazinga.js');
const feed = require('./commands/feed.js');
const hello = require('./commands/hello.js');
const hug = require('./commands/hug.js');
const hunger = require('./commands/hunger.js');
const love = require('./commands/love.js');
const meow = require('./commands/meow.js');
const mood = require('./commands/mood.js');
const pet = require('./commands/pet.js');
const pspsps = require('./commands/pspsps.js');
const speak = require('./commands/speak.js');
const sus = require('./commands/sus.js');
const vibe = require('./commands/vibe.js');

module.exports.commands = [bazinga, feed, hello, hug, hunger, love, meow, mood, pet, pspsps, speak, sus, vibe];

// admin
const toggle = require('./admin/toggle.js');

module.exports.admin = [toggle];

// triggers
const susTrigger = require('./triggers/sus.js');

module.exports.triggers = [susTrigger];