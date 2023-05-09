const strings = require('../../strings/strings.json');
const awaitHandlerInstance = require('../../utils/await');
const welcome = response => {
    return strings.default.welcome.some(i => {
        const newRegex = new RegExp(i, 'gmi');
        return newRegex.test(response);
    });
};

module.exports = {
    async execute(interaction, guildUserCat) {
        const reply = await guildUserCat.getReaction('catsounds');
        await interaction.reply(reply);
        awaitHandlerInstance.set(interaction.author.id);
        const collector = interaction.channel.createMessageCollector({ filter: welcome, max: 1, time: 10000 });
        collector.on('collect', async newMessage => {
            await guildUserCat.user.positive();
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
	name: 'meow',
	description: 'Reacts to various cat sounds',
	summon: 'cat noises',
};
module.exports.settings = {
	regexp: /\b(?:me+o+w+|cats?|ma+u+|me+w+|meor|nya+.?|miaou+|mi+a+u+|mlem|mrrr+)\b/mi,
	flags: 'gmi',
	tag: 'meow',
	chance: 9,
	await: true,
};