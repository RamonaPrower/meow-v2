const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('mood')
		.setDescription('Meow\'s mood'),
	async execute(interaction, guildUserCat) {
		const reply = await guildUserCat.getReaction('mood', true);
		await interaction.reply(reply);
	},
};

module.exports.info = {
	name: 'Mood',
	description: 'Meow\'s mood',
	summon: 'mood',
};
module.exports.settings = {
	regexp: /mood$/mi,
	tag: 'mood',
	sim: true,
};