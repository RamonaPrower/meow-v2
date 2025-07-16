const Discord = require('discord.js');
const { Guild } = require('../models/guild');
const strings = require('../strings/strings.json');

/**
 * The Settings Handler of each Guild
 * This stores the settings in memory to save on DB queries
 * @constructor
 * @author Ramona Prower
 * @this {GuildSettings}
 */
class GuildSettings {
    constructor() {
        this.guilds = new Discord.Collection();
    }
    /**
     * Gets the settings of the guild supplied, via ID
     * @param {Snowflake} guildId The Guild ID
     */
    async getSettings(guildId) {
        if (this.guilds.get(guildId)) {
            return this.guilds.get(guildId);
        }
        else {
            let search = await Guild.checkGuild(guildId);
            if (!search) {
                const guild = new Guild({
                    snowflake: guildId,
                });
                await guild.save();
                search = await Guild.checkGuild(guildId);
            }
            this.guilds.set(guildId, {
                shouting: search.enableShouting,
                hunger: search.enableHunger,
                skin: search.skin,
            });
            return this.guilds.get(guildId);
        }
    }
    /**
     * Sets the skin of the cat (this controls what strings are used for the cat)
     * @param {Snowflake} guildId The guild ID
     * @param {String} skin The skin to set
     * @returns {Object} The settings of the guild
     */
    async setSkin(guildId, skin) {
        const search = await Guild.checkGuild(guildId);
        // check if it's a valid option
        if (!strings[skin]) {
            search.skin = 'default';
        }
        else {
            search.skin = skin;
        }
        await search.save();
        this.guilds.set(guildId, {
            shouting: search.enableShouting,
            hunger: search.enableHunger,
            skin: search.skin,
        });
        return this.guilds.get(guildId);
    }
    /**
     * Toggles the shouting command on a server
     * @param {Snowflake} guildId The guild ID
     * @returns {Object} The settings of the guild
     */
    async toggleShouting(guildId, force) {
        const search = await Guild.checkGuild(guildId);
        if (!force) {
            if (search.enableShouting === true) {
                search.enableShouting = false;
            }
            else {
                search.enableShouting = true;
            }
        }
        else {
            search.enableShouting = force;
        }
        await search.save();
        this.guilds.set(guildId, {
            shouting: search.enableShouting,
            hunger: search.enableHunger,
            skin: search.skin,
        });
        return this.guilds.get(guildId);
    }
    /**
     * Toggles the hunger system on a server
     * @param {Snowflake} guildId The guild ID
     * @returns {Object} The settings of the guild
     */
    async toggleHunger(guildId, force) {
        const search = await Guild.checkGuild(guildId);
        if (!force) {
            if (search.enableHunger === true) {
                search.enableHunger = false;
            }
            else {
                search.enableHunger = true;
            }
        }
        else {
            search.enableHunger = force;
        }
        await search.save();
        this.guilds.set(guildId, {
            shouting: search.enableShouting,
            hunger: search.enableHunger,
            skin: search.skin,
        });
        return this.guilds.get(guildId);
    }
}

module.exports.GuildSettings = GuildSettings;