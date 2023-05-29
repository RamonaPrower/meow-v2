module.exports = {
    async execute(interaction, guildUserCat) {
        const reply = await guildUserCat.getReaction('binkyfish');
        await interaction.reply(reply);
    },
};

module.exports.info = {
    name: 'binkyfish',
    description: 'Binky Fish Friday Supremacy',
    summon: 'binkyfish',
};
module.exports.settings = {
    regexp: /binky\s?fish/mi,
    tag: 'binkyfish',
    chance: 10,
};