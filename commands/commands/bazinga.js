const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bazinga')
		.setDescription('do not bazinga me'),
	async execute(interaction, cat) {
        const reply = await cat.getReaction('bazinga');
		await interaction.reply(reply);
	},
};
module.exports.info = {
	name: 'bazinga',
	description: 'bazinga',
	summon: 'bazinga',
};
module.exports.settings = {
	regexp: /\b(bazinga|bojangles|zimbabwe|bazlooples|bazpingo|basengan|terfs|transphobes)\b/mi,
	tag: 'bazinga',
	sim: true,
    blockSlash: true,
};