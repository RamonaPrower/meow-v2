module.exports = {
    async execute(interaction, guildUserCat) {
        const reply = await guildUserCat.getReaction('bork');
        await interaction.reply(reply);
    },
};

module.exports.info = {
	name: 'bork',
	description: 'reacts on a bark',
	summon: ':3c',
};
module.exports.settings = {
	regexp: /\b(bo*rk|bjork)\b/mi,
	flags: 'gmi',
	tag: 'bork',
	chance: 15,
};