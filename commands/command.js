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
const stringTest = require('./admin/stringTest.js');

module.exports.admin = [toggle, stringTest];

// triggers
const blobcat = require('./triggers/blobcat.js');
const bork = require('./triggers/bork.js');
const catface = require('./triggers/catface.js');
const kawaii = require('./triggers/kawaii.js');
const meowTrigger = require('./triggers/meow.js');
const owo = require('./triggers/owo.js');
const pspspsTrigger = require('./triggers/pspsps.js');
const shouting = require('./triggers/shouting.js');
const susTrigger = require('./triggers/sus.js');

module.exports.triggers = [blobcat, bork, catface, kawaii, meowTrigger, owo, pspspsTrigger, shouting, susTrigger];