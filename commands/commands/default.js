const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('default')
		.setDescription('If meow is mentioned and no command is given, this is the default response'),
	async execute(interaction, guildUserCat) {
        // generate a dice roll out of 100
        const dice = Math.floor(Math.random() * 100) + 1;
        // if it's over 90, then send a random reaction
        if (dice > 90) {
            const options = ['bazinga', 'binkyfish', 'blobcat', 'bork', 'kawaii', 'meowdy', 'owo', 'pspsps', 'sus'];
            const reply = await guildUserCat.getReaction(options[Math.floor(Math.random() * options.length)]);
            await interaction.reply(reply);
        }
        // otherwise, send meow
        else {
            const reply = await guildUserCat.getReaction('meow', true);
            await interaction.reply(reply);
        }
	},
};

module.exports.info = {
	name: 'Default',
	description: 'If meow is mentioned and no command is given, this is the default response',
	summon: 'random',
};
module.exports.settings = {
	regexp: /\brandom\b/mi,
	tag: 'random',
	sim: true,
    blockSlash: true,
};