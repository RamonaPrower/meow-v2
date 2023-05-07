// during changes to the mongodb schemas, this script can be used to update each guild's schema to match the new one
const Guild = require('./models/guild');
const { GuildSettings } = require('./utils/guild');
const mongoose = require('mongoose');
const config = require('./config.json');

const guildSettings = new GuildSettings();

async function updateSchemas() {
    const guilds = await Guild.Guild.find({});
    for (const guild of guilds) {
        const settings = await guildSettings.getSettings(guild.snowflake);
        guild.enableSim = settings.sim;
        guild.enableShouting = settings.shouting;
        guild.skin = settings.skin;
        await guild.save();
    }
    console.log('Done!');
}

// connect to the database, test if we can access it, then run the updateSchemas function
mongoose.connect(config.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
        updateSchemas();
    })
    .catch((err) => {
        console.log(err);
    },
    );
