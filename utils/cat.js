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
        const overallMood = this.mood + (Math.round(this.user.happiness / 2));
        let foundString;
        let foundAction;
        // case break to determine what to do if moodBased is true
        if (moodBased) {
            switch (action) {
                case 'pet':
                    foundAction = this.strings.pet;
                    break;
                case 'meow':
                    foundAction = this.strings.meow;
                    break;
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

        }
        // if moodbased is false, then we're doing a specific action
        else {
            switch (action) {
                case 'bazinga':
                    foundAction = this.strings.bazinga;
                    break;
                case 'speak':
                    foundAction = this.strings.speak;
                    break;
                default:
                    foundAction = this.strings.meow;
                    console.log('defaulted, action was ' + action);
                    break;
            }
            // set the foundString to a random one from the array
            foundString = foundAction[Math.floor(Math.random() * foundAction.length)];
        }
        return foundString;

    }
}

module.exports.Cat = Cat;