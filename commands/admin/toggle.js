const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('toggle')
		.setDescription('Toggle settings on the server')
        .addStringOption(option =>
            option.setName('skin')
                .setDescription('The skin to use')
                .addChoices({ name: 'Default', value: 'default' }, { name: 'Fox', value: 'foxxo' }))
        .addBooleanOption(option =>
            option.setName('shouting')
                .setDescription('Whether or not to enable shouting')),
	async execute(interaction, guildSettings) {
        // check if this is an interaction, or a message command
        // as gross as this is, it's this or create two separate commands for the same thing
        const isCommand = interaction.isCommand();
        if (isCommand) {
            const guildId = interaction.guildId;
            const skin = interaction.options.getString('skin');
            const shouting = interaction.options.getBoolean('shouting');
            const thisGuildSettings = await guildSettings.getSettings(guildId);
            let stringToSend = '';
            if (skin) {
                await guildSettings.setSkin(guildId, skin);
                stringToSend += `Skin set to ${skin}\n`;
            }
            if (shouting !== null) {
                await guildSettings.toggleShouting(guildId, shouting);
                stringToSend += `Shouting set to ${shouting}\n`;
            }
            if (!skin && shouting === null) {
                stringToSend += `Skin: ${thisGuildSettings.skin}\nShouting: ${thisGuildSettings.shouting}`;
            }
            await interaction.reply(stringToSend);
        }
        else {
            const guildId = interaction.guild.id;
            const thisGuildSettings = await guildSettings.getSettings(guildId);
            const skin = interaction.content.match(/(?<=skin )\w+/mi);
            // shouting is a boolean so we can just check if it's in the message
            const shouting = interaction.content.contains('shouting');
            if (skin) {
                await guildSettings.setSkin(guildId, skin[0]);
                await interaction.reply(`Skin set to ${skin[0]}`);
            }
            if (shouting !== null) {
                const guild = await guildSettings.toggleShouting(guildId);
                await interaction.reply(`Shouting set to ${guild.shouting}`);
            }
            if (!skin && shouting === null) {
                await interaction.reply(`Skin: ${thisGuildSettings.skin}\nShouting: ${thisGuildSettings.shouting}`);
            }
        }
	},
};
module.exports.info = {
	name: 'toggle',
	description: 'toggle',
	summon: 'toggle',
};
module.exports.settings = {
	regexp: /\btoggle\b/mi,
	tag: 'toggle',
	sim: true,
};