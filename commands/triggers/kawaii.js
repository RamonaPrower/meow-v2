module.exports = {
    async execute(interaction, guildUserCat) {
		const reply = await guildUserCat.getReaction('kawaii');
		await interaction.reply(reply);
	},
};

module.exports.info = {
	name: 'kawaii',
	description: 'reacts on kawaii',
	summon: 'kawaii',
};
module.exports.settings = {
	regexp: /\bkawaii+\b/mi,
	tag: 'kawaii',
	chance: 15,
};