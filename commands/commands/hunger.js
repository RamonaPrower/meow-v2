const { SlashCommandBuilder } = require('discord.js');

module.exports = {
        data: new SlashCommandBuilder()
		.setName('hunger')
		.setDescription('Check if meow is hungry!'),
	async execute(interaction, guildUserCat) {
		const reply = await guildUserCat.getReaction('hunger');
		await interaction.reply(reply);
	},
};

module.exports.info = {
	name: 'Hunger',
	description: 'Cats Guild-wide hunger',
	summon: 'Hunger',
};
module.exports.settings = {
	regexp: /hunger$/mi,
	tag: 'hunger',
	sim: true,
};