const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('pet')
		.setDescription('Pet Meow'),
	async execute(interaction, guildUserCat) {
		const reply = await guildUserCat.getReaction('pet', true);
		await interaction.reply(reply);
	},
};

module.exports.info = {
	name: 'pet cat',
	description: 'Pet Meow',
	summon: 'pet',
};
module.exports.settings = {
	regexp: /pet$/mi,
	tag: 'pet_cat',
	sim: true,
};