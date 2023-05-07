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

client.messageAdmin = new Collection();
client.slashAdmin = new Collection();

const commandsAdmin = commandList.admin;
for (const file of commandsAdmin) {
	client.messageAdmin.set(file.settings.tag, file);
	client.slashAdmin.set(file.data.name, file);
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
    // admin
	if (message.author.id === message.guild.ownerId || message.member.permissions.has('MANAGE_CHANNELS')) {
		// message admin commands
		for (const [key, value] of client.messageAdmin) {
			if (value.settings.regexp.test(message.content)) {
				value.execute(message, guildSettings);
			}
		}
	}
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
	const thisGuildSettings = await guildSettings.getSettings(interaction.guildId);
	const guildUserCat = await Cat.create(interaction.guildId, interaction.user.id);
	// check for admin commands
	if (interaction.user.id === interaction.guild.ownerId || interaction.member.permissions.has('MANAGE_CHANNELS')) {
		const adminCommand = interaction.client.slashAdmin.get(interaction.commandName);
		if (adminCommand) {
			try {
				await adminCommand.execute(interaction, guildSettings);
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
			return;
		}
	}
	// now normal commands
	const command = interaction.client.slashCommands.get(interaction.commandName);
	if (command) {
		try {
			await command.execute(interaction, guildUserCat);
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
		return;
	}
});

client.on('error', data => {
	console.error('Connection Error', data.message);
});

client.login(config.discord)
	.then(console.log('Logged In'))
	.catch(console.error);