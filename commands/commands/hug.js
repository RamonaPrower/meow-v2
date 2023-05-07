const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Hug! That! Meow!'),
    async execute(interaction, guildUserCat) {
        const reply = await guildUserCat.getReaction('hug');
        await interaction.reply(reply);
        await guildUserCat.user.positive();
    },
};

module.exports.info = {
    name: 'hug',
    description: 'Hug! That! Meow!',
    summon: 'feed',
};
module.exports.settings = {
	regexp: /\b(hug\??|uppies\??|cuddles?\??)/mi,
	tag: 'hug',
    sim: true,
};