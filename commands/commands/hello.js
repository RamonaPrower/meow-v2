const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hello')
		.setDescription('say hellow to meow'),
	async execute(interaction, guildUserCat) {
		const reply = await guildUserCat.getReaction('hello', true);
		await interaction.reply(reply);
	},
};

module.exports.info = {
	name: 'hello',
	description: 'say hellow to meow',
	summon: 'hello',
};
module.exports.settings = {
	regexp: /\bhello\b/mi,
	tag: 'hello',
	sim: true,
};