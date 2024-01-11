const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('run this command to get helps'),
	async execute(interaction) {
        let text = `
# Help
*This bot is made for RottenCubing server*
Version: \`1.0\`
Author: \`Mattia Pasquini\`
## \`/<event>\` [...attempts]
This is a command where you can insert your results. To check the results, run the command \`/ranking\`. You can insert your results once per event.

The \`<event>\` parameter is id event. There are following options:
- 333
- 222
- 444
- 555
- 666
- 777
- 3bld
- 4bld
- 5bld
- skewb
- clock
- sq1
- mega

## \`/ranking\`
Show the ranking based on the results entered for all events.

## \`/scramble <event> <number>\`
Generate scramble.

## \`/dropresults\`
**ONLY ADMIN** can run this command. Drop the results on ranking so the other can race again.
`;
		await interaction.reply({content: text, ephemeral: true});
	},
};