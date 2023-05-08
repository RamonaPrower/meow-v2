const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('vibecheck')
		.setDescription('checking meow\'s vibes'),
	async execute(interaction, guildUserCat) {
        const reply = await guildUserCat.getReaction('vibecheck');
		await interaction.reply(reply);
	},
};

module.exports.info = {
	name: 'Vibe Check',
	description: 'checking meow\'s vibes',
    summon: 'vibe check',
};
module.exports.settings = {
	regexp: /vibe check$/mi,
	tag: 'vibe',
	sim: true,
};