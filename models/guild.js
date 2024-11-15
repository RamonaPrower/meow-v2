const mongoose = require('mongoose');
const moment = require('moment');

const guildSchema = new mongoose.Schema({
    snowflake: {
        type: String,
        required: true,
    },
    hunger: {
        type: Number,
        default: 10,
    },
    asleep: {
        type: Boolean,
        required: true,
        default: false,
    },
    lastUpdate:{
        type: Date,
        required: true,
        default: Date.now,
    },
    mood: {
        type: Number,
        required: true,
        default: 5,
    },
    enableSim: {
        type: Boolean,
        required: true,
        default: true,
    },
    enableTwitter: {
        type: Boolean,
        required: true,
        default: false,
    },
    enableShouting: {
        type: Boolean,
        required: true,
        default: true,
    },
    skin: {
        type: String,
        required: true,
        default: 'default',
    },
    interactionCount: {
        type: Number,
        required: true,
        default: 0,
    }
});
guildSchema.statics.checkGuild = async function(snowflake) {
    return this.findOne({
        snowflake: snowflake,
    });
};
// before any find, we want to update all the basics
// hunger, mood, sleeping, etc
// also this way means we can't forget to do it
guildSchema.pre('findOne', async function() {
    let foundGuild = await this.model.find(this.getFilter());
    if (foundGuild.length === 0) return;
    foundGuild = foundGuild[0];
    const timeNow = new Date();
    const diff = moment().diff(foundGuild.lastUpdate, 'hours');
    if (diff === 0) return;
    if (diff > 96) {
        // if it's been more than 4 days, give the user a grace period
        foundGuild.interactionCount = 3;
    }
    let newHunger = foundGuild.hunger - diff;
    if (newHunger < 0) newHunger = 0;
    foundGuild.hunger = newHunger;
    const dice = Math.floor(Math.random() * 101);
    if (dice <= 20) {
        foundGuild.asleep = true;
    }
    else {
        foundGuild.asleep = false;
    }
    // mood out of 10, quadratically decreasing so he's more likely to be happy
    const moodDice = Math.floor(Math.sqrt(Math.random() * 100));
    foundGuild.mood = moodDice;
    foundGuild.lastUpdate = timeNow;
    await foundGuild.save();
});

guildSchema.methods.updateHunger = function() {
    const timeNow = new Date();
    const diff = moment().diff(this.lastUpdate, 'hours');
    if (diff === 0) return;
    let newHunger = this.hunger - diff;
    if (newHunger < 0) newHunger = 0;
    this.hunger = newHunger;
    this.lastUpdate = timeNow;
    this.save();
};
guildSchema.methods.feed = async function() {
    this.hunger = 10;
    this.lastUpdate = new Date();
    await this.save();
};
guildSchema.methods.wakeUp = async function() {
    const diff = moment().diff(this.lastUpdate, 'hours');
    this.asleep = false;
    if (diff === 0) {
        let newHunger = this.hunger - diff;
        if (newHunger < 0) newHunger = 0;
        this.hunger = newHunger;
        this.lastUpdate = new Date();
    }
    await this.save();
};
guildSchema.methods.happyMood = async function() {
    // force the mood to be happy, random between 7 and 10
    const moodDice = Math.floor(Math.random() * 4) + 7;
    this.mood = moodDice;
    await this.save();
    return moodDice;
};

const Guild = mongoose.model('Guild', guildSchema);
exports.Guild = Guild;