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
			await interaction.reply({ content: "how can I generate 0 or a negative number of scrambles...", ephemeral: true });
			return;
		}else if(number > 15){
			await interaction.reply({ content: "Isn't too much the number of scrambles you've selected? Bruh", ephemeral: true })
			return;
		}
		try{
			let str = `### ${event}\n`;
			for (let i = 0; i < number; i++) {
				str += `${i + 1}. ${scr[event]()}\n`;
			}
			await interaction.reply(str);
		}catch{
			await interaction.reply({ content: "Something went wrong, you may have misspelled the event name. Write `/help` for more infos.", ephemeral: true })
		}
	},
};