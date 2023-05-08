const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('sus')
		.setDescription('when the meow is sus'),
	async execute(interaction, guildUserCat) {
        const reply = await guildUserCat.getReaction('sus');
		await interaction.reply(reply);
	},
};


module.exports.info = {
	name: 'sus',
	description: 'when the meow is sus',
	summon: 'sus',
};
module.exports.settings = {
	regexp: /\bsus\b/mi,
	tag: 'sus',
	sim: true,
    blockSlash: true,
};
