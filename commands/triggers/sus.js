module.exports = {
	async execute(interaction, guildUserCat) {
        const reply = await guildUserCat.getReaction('sus');
		await interaction.reply(reply);
	},
};

module.exports.info = {
	name: 'sus',
	description: 'when the meow is sus',
    summon: 'sus',
};
module.exports.settings = {
	regexp: /\bsus\b/mi,
	tag: 'sus',
	chance: 10,
};