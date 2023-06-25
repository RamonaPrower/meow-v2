const stringBuilder = require('../../utils/stringBuilder.js');
const { Cat } = require('../../utils/cat.js');
const config = require('../../config.json');

module.exports = {
    async execute(interaction, guildSettings) {
        // only work in dev
        if (config.dev !== true) {
            return;
        }
        // generate a cat Class
        const cat = await Cat.create(interaction.guild.id, interaction.author.id);
        // find all strings in the json object that buildStrings outputs, there can be objects within objects
        const strings = stringBuilder.buildStrings(cat.skin);
        // expand all strings into an array
        let stringArray = [];
        Object.keys(strings).forEach((key) => {
            // we only want the strings, not the objects
            if (typeof strings[key] === 'string') {
                // if it's a string, add it to the array
                stringArray.push(strings[key]);
            }
            else {
                Object.keys(strings[key]).forEach((key2) => {
                    // add onto the array, as we might have multiple strings in an object
                    if (typeof strings[key][key2] === 'string') {
                        stringArray.push(strings[key][key2]);
                    }
                    else {
                        // this will always be an array, just expand it into the array
                        stringArray.push(...strings[key][key2]);
                    }

                });
            }
        });
        // make sure we have no duplicates in the array
        stringArray = [...new Set(stringArray)];
        // split the array, making sure we don't go over the 2000 character limit
        const splitArray = [];
        let currentString = '';
        stringArray.forEach((string) => {
            if (currentString.length + string.length > 2000) {
                splitArray.push(currentString);
                currentString = '';
            }
            currentString += `${string}\n`;
        });
        splitArray.push(currentString);
        // send the strings
        splitArray.forEach(async (string) => {
            await interaction.reply(string);
        },
        );

    },
};

module.exports.info = {
    name: 'stringtest',
    description: 'test all strings',
    summon: 'stringtest',
};
module.exports.settings = {
    regexp: /\bstringtest\b/mi,
    tag: 'stringtest',
    blockSlash: true,
};