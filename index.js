// setting up the discord bot
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const config = require('./config.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
] });
const commandList = require('./commands/command');
const { GuildSettings } = require('./utils/guild');
const { Cat } = require('./utils/cat');
const guildSettings = new GuildSettings;
const { performance } = require('perf_hooks');

// suspect i'm going to have to come back to this and get a bit lost with my pattern so i'm going to explain it here
// the commandList is a file that exports a list of all the commands
// Commands have two ways of being called, message commands and slash commands
// message commands are the old way of doing things, slash commands are the new way of doing things
// if the prefix of a collection is messsage, then it's a message command (messageCommands, messageReactions, etc)
// if the prefix of a collection is slash, then it's a slash command (slashCommands mostly as you can't react in the same way to a slash command)
// so for each section in the commandList, decide if it needs to be a message command or a slash command, or both

client.messageCommands = new Collection();
client.slashCommands = new Collection();

const commandsComms = commandList.commands;
for (const file of commandsComms) {
	client.messageCommands.set(file.settings.tag, file);
    client.slashCommands.set(file.data.name, file);
}


client.once(Events.ClientReady, () => {
    console.log('Connected to Discord');
	// connect to mongodb
	const mongoose = require('mongoose');
	mongoose.connect(config.db, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
		.then(console.log('Connected to MongoDB'));
});

// this is for message commands (not slash commands)
client.on(Events.MessageCreate, async message => {
	if (message.author.bot || message.mentions.everyone === true) return;
	// checking for server outages
	if (message.guild.available === false) return;
	// is meow mentioned
	const mentioned = message.mentions.has(client.user);
	// get the settings for the guild
	const thisGuildSettings = await guildSettings.getSettings(message.guild.id);
	// make a guildUserCat (just for testing, this will be ordinarily called from the command to save db calls when not needed)
	const guildUserCat = await Cat.create(message.guild.id, message.author.id);
    // commands
    for (const [key, value] of client.messageCommands) {
        if (value.settings.regexp.test(message.content)) {
            value.execute(message, guildUserCat);
        }
    }

});

// this is for slash commands
client.on(Events.InteractionCreate, async interaction => {
    console.log('picked up an interaction');
    if (!interaction.isChatInputCommand()) return;
	// we're timing this, it's a bit slow
	const start = performance.now();
	const thisGuildSettings = await guildSettings.getSettings(interaction.guildId);
	const guildTimer = performance.now() - start;
	const guildUserCat = await Cat.create(interaction.guildId, interaction.user.id);
	const userTimer = performance.now() - start - guildTimer;
	const command = interaction.client.slashCommands.get(interaction.commandName);
	const commandTimer = performance.now() - start - guildTimer - userTimer;
	console.log(`Guild: ${Math.round(guildTimer)}ms, User: ${Math.round(userTimer)}ms, Command: ${Math.round(commandTimer)}ms, Total: ${Math.round(performance.now() - start)}ms`);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		// is the slow bit here?
		const start = performance.now();
		await command.execute(interaction, guildUserCat);
		const commandTimer = performance.now() - start;
		console.log(`Command: ${Math.round(commandTimer)}ms`);
	}
 catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		}
 else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.on('error', data => {
	console.error('Connection Error', data.message);
});

client.login(config.discord)
	.then(console.log('Logged In'))
	.catch(console.error);