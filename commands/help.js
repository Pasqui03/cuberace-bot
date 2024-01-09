const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('run this command to get helps'),
	async execute(interaction) {
		await interaction.reply('...');
	},
};