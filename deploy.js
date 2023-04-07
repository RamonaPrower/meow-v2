const { REST, Routes } = require('discord.js');
const config = require('./config.json');

const commands = [];

const commandList = require('./commands/command');
const commandsComms = commandList.commands;
for (const file of commandsComms) {
	commands.push(file.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(config.discord);

// and deploy your commands!
(async () => {

	// check the config to see if we're in dev mode or not
	// if we're in dev mode, then we're going to deploy to the test server
	// if we're not in dev mode, then we're going to deploy to application commands

	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		if (config.dev === true) {
			const data = await rest.put(
				Routes.applicationGuildCommands(config.clientId, config.discordTestGuild),
				{ body: commands },
			);
			console.log(`Successfully reloaded ${data.length} application (/) commands for the test server`);
		}
		else {
			const data = await rest.put(
				Routes.applicationCommands(config.clientId),
				{ body: commands },
			);
			console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		}


	}
 catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();