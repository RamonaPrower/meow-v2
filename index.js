// setting up the discord bot
const { Client, Collection, Events, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const config = require('./config.json');
const client = new Client({
	intents: [GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	],
});
const commandList = require('./commands/command');
const { GuildSettings } = require('./utils/guild');
const { Cat } = require('./utils/cat');
const guildSettings = new GuildSettings;
const awaitHandler = require('./utils/await');

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
	if (file.settings.blockSlash !== true) {
		client.slashCommands.set(file.data.name, file);
	}
}

client.messageAdmin = new Collection();
client.slashAdmin = new Collection();

const commandsAdmin = commandList.admin;
for (const file of commandsAdmin) {
	client.messageAdmin.set(file.settings.tag, file);
	if (file.settings.blockSlash !== true) {
		client.slashAdmin.set(file.data.name, file);
	}

}

client.messageTriggers = new Collection();

const commandsTriggers = commandList.triggers;
for (const file of commandsTriggers) {
	client.messageTriggers.set(file.settings.tag, file);
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
	// checking for if user is in await list
	if (awaitHandler.get(message.author.id) === true) return;
	// is meow mentioned
	const mentioned = message.mentions.has(client.user);
	// get the settings for the guild
	// admin
	if (mentioned === true && (message.author.id === message.guild.ownerId || message.member.permissions.has(PermissionsBitField.Flags.ManageChannels))) {
		// message admin commands
		for (const [, value] of client.messageAdmin) {
			if (value.settings.regexp.test(message.content)) {
				console.log('admin command called');
				value.execute(message, guildSettings);
				return;
			}
		}
	}
	// commands
	if (mentioned === true) {
		for (const [, value] of client.messageCommands) {
			if (value.settings.regexp.test(message.content)) {
				// saves on cat calls! (https://www.youtube.com/watch?v=YNkzmP4ypOk)
				console.log('command called');
				const guildUserCat = await Cat.create(message.guild.id, message.author.id);
				value.execute(message, guildUserCat);
				return;
			}
		}
		// if there's nothing that matches, run the default command
		const guildUserCat = await Cat.create(message.guild.id, message.author.id);
		client.messageCommands.get('default').execute(message, guildUserCat);
	}
	// triggers
	const dice = Math.floor(Math.random() * 100) + 1;
	for (const [, value] of client.messageTriggers) {
		// if dice is less than or equal to the chance of the trigger, then run it
		if (dice <= value.settings.chance || config.dev === true) {
			if (value.settings.regexp.test(message.content)) {
				console.log(`Triggered ${value.info.name} with ${dice}`);
				const guildUserCat = await Cat.create(message.guild.id, message.author.id);
				value.execute(message, guildUserCat);
				return;

			}
		}
	}

});

// this is for admin slash commands
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const guildUserCat = await Cat.create(interaction.guildId, interaction.user.id);
	// check for admin commands
	if (interaction.user.id === interaction.guild.ownerId || interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
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
	// now normal slash commands
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