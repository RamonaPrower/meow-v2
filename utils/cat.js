// imports
const stringBuilder = require('../utils/stringBuilder');
const { Guild } = require('../models/guild');
const { User } = require('../models/user');

/**
 * Creates a new Cat object.
 * @constructor
 * @author "Ramona Prower"
 */

class Cat {
    constructor(guildSearch, userSearch, skin = 'default') {
        // mood is controlled by the guild model, updates every time that a search is called for the guild
        this.mood = guildSearch.mood;
        this.guild = guildSearch;
        this.hunger = guildSearch.hunger;
        this.user = userSearch;
        this.skin = skin;
        this.strings = stringBuilder.buildStrings(skin);

    }
    /**
     * Create the cat for use
     * @param {guildId} guildId
     * @param {userId} userId
     * @param {skin} skin
    */
    static async create(guildId, userId) {
        let guildSearch = await Guild.checkGuild(guildId);
        // if there's no guild, make one
        if (!guildSearch) {
            const newGuild = new Guild({
                snowflake: guildId,
            });
            await newGuild.save();
            guildSearch = newGuild;
        }

        let userSearch = await User.checkUser(userId);
        // same with the user
        if (!userSearch) {
            const newUser = new User({
                snowflake: userId,
            });
            await newUser.save();
            userSearch = newUser;
        }

        return new Cat(guildSearch, userSearch, guildSearch.skin);
    }
    async getReaction(action, moodBased = false) {
        // little bit of randomness to make it more fun
        const hundredSidedDice = Math.floor(Math.random() * 100) + 1;
        // calculate "proper" mood
        let overallMood = this.mood + (Math.round(this.user.happiness / 2));
        let foundString;
        let foundAction;
        // case break to determine what to do if moodBased is true
        if (moodBased) {
            switch (action) {
                case 'pet':
                    foundAction = this.strings.pet;
                    break;
                case 'mood':
                case 'meow':
                    foundAction = this.strings.meow;
                    break;
                case 'hello':
                case 'love':
                    foundAction = this.strings.love;
                    break;
                default:
                    foundAction = this.strings.meow;
                    console.log('defaulted, action was ' + action);
                    break;
            }
            // less or equal to 3 is sad
            // less or equal to 6 is neutral
            // everything else is happy
            if (overallMood <= 3) {
                foundString = foundAction.sad;
            }
            else if (overallMood <= 6) {
                foundString = foundAction.neutral;
            }
            else {
                foundString = foundAction.happy;
            }
            // few overrides to the strings to make it more fun
            // if meow is asleep or hungry, then those strings override, in that order
            if (this.guild.asleep && this.user.happiness <= 8) {
                foundString = this.strings.asleep[Math.floor(Math.random() * this.strings.asleep.length)];
                return foundString;
            }
            else if (this.hunger <= 4) {
                foundString = this.strings.hunger.yes[Math.floor(Math.random() * this.strings.hunger.yes.length)];
                return foundString;
            }
            // love has special rules, it will always generate a positive interaction for the user, but it will also have a chance to make the cat happy
            if (action === 'love') {
                await this.user.positive();
                // 20% chance to make the cat happy as well, if it's sad or neutral
                if (overallMood <= 6 && hundredSidedDice <= 20) {
                    overallMood = await this.guild.happyMood();
                }
                if (overallMood <= 3) {
                    foundString = foundAction.sad;
                }
                else if (overallMood <= 6) {
                    foundString = foundAction.neutral;
                }
                else {
                    foundString = foundAction.happy;
                }
                return foundString[Math.floor(Math.random() * foundString.length)];
            }
            // hello is a simple greeting, but it will also have a chance to make the cat happy
            if (action === 'hello') {
                // 10% chance to make the cat happy as well, if it's sad or neutral
                if (overallMood <= 6 && hundredSidedDice <= 10) {
                    overallMood = await this.guild.happyMood();
                }
                if (overallMood <= 3) {
                    foundString = foundAction.sad;
                }
                else if (overallMood <= 6) {
                    foundString = foundAction.neutral;
                }
                else {
                    foundString = foundAction.happy;
                }
                return foundString[Math.floor(Math.random() * foundString.length)];
            }
            // if the cat is happy, then petting it will make it like the user more
            if (action === 'pet' && overallMood >= 6) {
                await this.user.positive();
            }
            return foundString[Math.floor(Math.random() * foundString.length)];

        }
        // if moodbased is false, then we're doing a specific action
        else {
            switch (action) {
                case 'bazinga':
                    foundAction = this.strings.bazinga;
                    break;
                case 'blobcat':
                    foundAction = this.strings.blobcat;
                    break;
                case 'bork':
                    foundAction = this.strings.bork;
                    break;
                case 'hug':
                    foundAction = this.strings.hug;
                    break;
                case 'hunger':
                    foundAction = this.strings.hunger;
                    break;
                case 'pspsps':
                    foundAction = this.strings.pspsps;
                    break;
                case 'speak':
                    foundAction = this.strings.speak;
                    break;
                case 'sus':
                    foundAction = this.strings.sus;
                    break;
                case 'vibecheck':
                    foundAction = this.strings.vibe;
                    break;
                default:
                    foundAction = this.strings.meow;
                    console.log('defaulted, action was ' + action);
                    break;
            }
            if (action === 'hunger') {
                if (this.hunger <= 4) {
                    foundString = foundAction.yes[Math.floor(Math.random() * foundAction.yes.length)];
                }
                else {
                    foundString = foundAction.no[Math.floor(Math.random() * foundAction.no.length)];
                }
                return foundString;
            }
            // set the foundString to a random one from the array
            foundString = foundAction[Math.floor(Math.random() * foundAction.length)];
        }
        return foundString;

    }
    async feed() {
        // if hunger is below 4, then meow is hungy
        const hungy = this.hunger <= 4;

        if (hungy) {
            await this.guild.feed();
            await this.guild.wakeUp();
            await this.user.positive();
            return this.strings.fed[Math.floor(Math.random() * this.strings.fed.length)];
        }
        else {
            return this.strings.hunger.no[Math.floor(Math.random() * this.strings.hunger.no.length)];
        }
    }
    async wake() {
        // if the cat is asleep, then wake it up
        if (this.guild.asleep) {
            await this.guild.wakeUp();
        }
    }
}

module.exports.Cat = Cat;