module.exports = {
    async execute(interaction, guildUserCat) {
        const reply = await guildUserCat.getReaction('owo');
        await interaction.reply(reply);
    },
};

module.exports.info = {
	name: 'owo',
	description: 'reacts on owos and uwus',
    summon: 'owo',
};
module.exports.settings = {
	regexp: /\b(owo|uwu)\b/mi,
	tag: 'owo',
	chance: 15,
};
