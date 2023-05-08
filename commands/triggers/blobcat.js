module.exports = {
    async execute(interaction, guildUserCat) {
        const reply = await guildUserCat.getReaction('catblob');
        await interaction.reply(reply);
    },
};

module.exports.info = {
	name: 'catblob',
	description: 'reacts on a catblob emoji',
    summon: 'catblob',
};
module.exports.settings = {
	regexp: /.*blobcatheart.*/mi,
	tag: 'catblob',
	chance: 15,
};
