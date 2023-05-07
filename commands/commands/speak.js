const { SlashCommandBuilder } = require('discord.js');
const { performance } = require('perf_hooks');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('speak')
		.setDescription('meow does a speak'),
	async execute(interaction, guildUserCat) {
		// why is this so slow i dont understand
		const t0 = performance.now();
        const reply = await guildUserCat.getReaction('speak');
        const t1 = performance.now();
		await interaction.reply(reply);
		const t2 = performance.now();
		console.log(`speak: ${Math.round(t1 - t0)}ms, reply: ${Math.round(t2 - t1)}ms`);
	},
};
module.exports.info = {
	name: 'speak',
	description: 'meow does a speak',
	summon: 'speak',
};
module.exports.settings = {
	regexp: /\bspeak\b/mi,
	tag: 'speak',
	sim: true,
};