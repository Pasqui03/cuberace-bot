const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('givewinnerrole')
		.setDescription('Give automatically to winner a role'),
	async execute(interaction) {
		await interaction.reply('developing');
	},
};