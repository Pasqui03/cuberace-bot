const { SlashCommandBuilder } = require('discord.js');

const scr = require("../utils/scr");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('scramble')
		.setDescription('Give automatically to winner a role')
		.addStringOption(option =>
			option.setName('event')
				.setDescription('event id')
				.setRequired(true)
		)
		.addIntegerOption(option =>
			option.setName('number')
				.setDescription('number of scrambles')
				.setRequired(true)
		),
	async execute(interaction) {
		let event = interaction.options.getString("event").trim();
		let number = interaction.options.getInteger("number");
		if (number <= 0) {
			await interaction.reply({ content: "How do I generate a number negative of scrambles...", ephemeral: true });
			return;
		}
		try{
			let str = `### ${event}\n`;
			for (let i = 0; i < number; i++) {
				str += `${i + 1}. ${scr[event]()}\n`;
			}
			await interaction.reply(str);
		}catch{
			await interaction.reply({ content: "Something went wrong, you may misspelled the event name. Write `/help` for more infos.", ephemeral: true })
		}
	},
};