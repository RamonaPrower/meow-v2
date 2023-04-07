const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('ping!');
	},
};
module.exports.info = {
	name: 'ping',
	description: 'ping',
	summon: 'ping',
};
module.exports.settings = {
	regexp: /\bping\b/mi,
	tag: 'ping',
	sim: true,
};