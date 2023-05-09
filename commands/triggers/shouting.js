const strings = require('../../strings/strings.json');
const awaitHandlerInstance = require('../../utils/await');
const calming = response => {
    return strings.default.calmphrases.some(i => {
        const newRegex = new RegExp(i, 'gmi');
        return newRegex.test(response);
    });
};

module.exports = {
    async execute(interaction, guildUserCat) {
        const reply = await guildUserCat.getReaction('shout');
        await interaction.reply(reply);
        awaitHandlerInstance.set(interaction.author.id);
        const collector = interaction.channel.createMessageCollector({ filter: calming, max: 1, time: 10000 });
        collector.on('collect', async newMessage => {
            const followUp = await guildUserCat.getReaction('pet', true);
            await newMessage.reply(followUp);
            collector.stop();
        });
        collector.on('end', async () => {
            awaitHandlerInstance.delete(interaction.author.id);
        });
    },
};

module.exports.info = {
	name: 'shout',
	description: 'Reacts when there\'s shouting on the server',
	summon: 'CAPS LOCK',
};
module.exports.settings = {
	regexp: /(?=[A-Z0-9]+)^[A-Z0-9\s\W]{10,}$/m,
	tag: 'shout',
	chance: 7,
	await: true,
};