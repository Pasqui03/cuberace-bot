const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('docs')
		.setDescription('Show the doc of this bot'),
	async execute(interaction) {
		await interaction.reply('Read the doc: pasqui03.github.io/cuberace-bot/');
	},
};