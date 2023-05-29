module.exports = {
    async execute(interaction, guildUserCat) {
        const reply = await guildUserCat.getReaction('meowdy');
        await interaction.reply(reply);
    },
};

module.exports.info = {
    name: 'meowdy',
    description: 'meowdy everyone',
    summon: 'meowdy',
};
module.exports.settings = {
    regexp: /(meowdy|meowboy)/mi,
    tag: 'meowdy',
    chance: 10,
};