module.exports = {
	async execute(interaction, guildUserCat) {
		await guildUserCat.wake();
        const reply = await guildUserCat.getReaction('pspsps');
		await interaction.reply(reply);
	},
};

module.exports.info = {
	name: 'pspsps',
	description: 'reacts on pspsps',
    summon: 'pspsps',
};
module.exports.settings = {
	regexp: /^(ps){3,}$/mi,
	tag: 'pspsps',
	chance: 15,
};