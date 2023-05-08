const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('feed')
        .setDescription('Feed meow'),
    async execute(interaction, cat) {
        const reply = await cat.feed();
        await interaction.reply(reply);
    },
};
module.exports.info = {
    name: 'feed',
    description: 'feed',
    summon: 'feed',
};
module.exports.settings = {
    regexp: /\bfeed\b/mi,
    tag: 'feed',
    sim: true,
};
