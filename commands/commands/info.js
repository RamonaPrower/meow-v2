const { SlashCommandBuilder } = require('discord.js');
const strings = require('../../strings/strings.json');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Information on Meow'),
	async execute(interaction, guildUserCat) {
        const reply = strings.default.info;
        // merge reply as it's an array
        await interaction.reply(reply.join('\n'));
        const followUp = await guildUserCat.getReaction('momsfollowup');
        await interaction.channel.send(followUp);
	},
};

module.exports.info = {
	name: 'info',
	description: 'Information on Meow',
	summon: 'info',
};
module.exports.settings = {
	regexp: /info$/mi,
	tag: 'info',
	sim: true,
};