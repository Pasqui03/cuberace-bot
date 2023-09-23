const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ranking')
        .setDescription('Show the ranking of cubing race'),
    async execute(interaction) {
        await interaction.reply('developing');
    },
};