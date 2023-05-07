const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('love')
		.setDescription('when someone loves meow'),
	async execute(interaction, guildUserCat) {
		const reply = await guildUserCat.getReaction('love', true);
		await interaction.reply(reply);
	},
};

module.exports.info = {
	name: 'love',
	description: 'when someone loves meow',
	summon: 'love',
};
module.exports.settings = {
	regexp: /(\blove|i would die for|cute)/mi,
	tag: 'love',
	sim: true,
};