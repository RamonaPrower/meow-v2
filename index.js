// setting up the discord bot
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const config = require('./config.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
] });
const commandList = require('./commands/command');

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
});

// this is for message commands (not slash commands)
client.on(Events.MessageCreate, message => {
	if (message.author.bot || message.mentions.everyone === true) return;
	// checking for server outages
	if (message.guild.available === false) return;

    // commands
    for (const [key, value] of client.messageCommands) {
        if (value.settings.regexp.test(message.content)) {
            value.execute(message);
        }
    }

});

// this is for slash commands
client.on(Events.InteractionCreate, async interaction => {
    console.log('picked up an interaction');
    if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.slashCommands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
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