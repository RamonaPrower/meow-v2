const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('pspsps')
		.setDescription('Get Meow\'s attention'),
	async execute(interaction, guildUserCat) {
		await guildUserCat.wake();
        const reply = await guildUserCat.getReaction('pspsps');
		await interaction.reply(reply);
	},
};

module.exports.info = {
	name: 'pspsps',
	description: 'Wakes up Meow if asleep',
    summon: 'pspsps',
};
module.exports.settings = {
	regexp: /\b(ps){3,}$/mi,
	tag: 'pspsps',
	sim: true,
};