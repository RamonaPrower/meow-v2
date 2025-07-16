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
                .setDescription('Whether or not to enable shouting'))
        .addBooleanOption(option =>
            option.setName('hunger')
                .setDescription('Whether or not to enable hunger system')),
	async execute(interaction, guildSettings) {
        // check if this is an interaction, or a message command
        // as gross as this is, it's this or create two separate commands for the same thing
        if (interaction.isCommand()) {
            const guildId = interaction.guildId;
            const skin = interaction.options.getString('skin');
            const shouting = interaction.options.getBoolean('shouting');
            const hunger = interaction.options.getBoolean('hunger');
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
            if (hunger !== null) {
                await guildSettings.toggleHunger(guildId, hunger);
                stringToSend += `Hunger set to ${hunger}\n`;
            }
            if (!skin && shouting === null && hunger === null) {
                stringToSend += `Skin: ${thisGuildSettings.skin}\nShouting: ${thisGuildSettings.shouting}\nHunger: ${thisGuildSettings.hunger}`;
            }
            await interaction.reply(stringToSend);
        }
        else {
            const guildId = interaction.guild.id;
            const thisGuildSettings = await guildSettings.getSettings(guildId);
            const skin = interaction.content.match(/(?<=skin )\w+/mi);
            // shouting is a boolean so we can just check if it's in the message
            const shouting = interaction.content.includes('shouting');
            const hunger = interaction.content.includes('hunger');
            if (skin) {
                await guildSettings.setSkin(guildId, skin[0]);
                await interaction.reply(`Skin set to ${skin[0]}`);
            }
            if (shouting) {
                const guild = await guildSettings.toggleShouting(guildId);
                await interaction.reply(`Shouting set to ${guild.shouting}`);
            }
            if (hunger) {
                const guild = await guildSettings.toggleHunger(guildId);
                await interaction.reply(`Hunger set to ${guild.hunger}`);
            }
            if (!skin && !shouting && !hunger) {
                await interaction.reply(`Skin: ${thisGuildSettings.skin}\nShouting: ${thisGuildSettings.shouting}\nHunger: ${thisGuildSettings.hunger}`);
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