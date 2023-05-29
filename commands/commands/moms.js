const strings = require('../../strings/strings.json');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('moms')
        .setDescription('Info about my moms'),
    async execute(interaction, guildUserCat) {
        const reply = strings.default.moms;
        // merge reply as it's an array
        await interaction.reply(reply.join('\n'));
        const followUp = await guildUserCat.getReaction('momsfollowup');
        await interaction.channel.send(followUp);
    },
};

module.exports.info = {
	name: 'Moms',
	description: 'links of creators',
	summon: '@me moms',
};
module.exports.settings = {
	regexp: /moms$/mi,
	tag: 'moms',
};