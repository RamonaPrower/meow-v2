const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('speak')
		.setDescription('meow does a speak'),
	async execute(interaction, guildUserCat) {
        const reply = await guildUserCat.getReaction('speak');
		await interaction.reply(reply);
	},
};
module.exports.info = {
	name: 'speak',
	description: 'meow does a speak',
	summon: 'speak',
};
module.exports.settings = {
	regexp: /\bspeak\b/mi,
	tag: 'speak',
	sim: true,
};