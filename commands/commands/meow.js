const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('meow')
		.setDescription('Meow does a meow'),
	async execute(interaction, guildUserCat) {
		const reply = await guildUserCat.getReaction('meow', true);
		await interaction.reply(reply);
	},
};

module.exports.info = {
	name: 'meow',
	description: 'Meow does a meow',
	summon: 'meow',
};
module.exports.settings = {
	regexp: /meow$/mi,
	tag: 'meow',
	sim: true,
};
