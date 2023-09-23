const { SlashCommandBuilder } = require('discord.js');

module.exports = (eventname) => {
    return {
        data: new SlashCommandBuilder()
            .setName(eventname)
            .setDescription(`Compete with ${eventname} event`)
            .addStringOption(option =>
                option.setName('attempt1')
                    .setDescription('first attempt')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option.setName('attempt2')
                    .setDescription('second attempt')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option.setName('attempt3')
                    .setDescription('third attempt')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option.setName('attempt4')
                    .setDescription('fourth attempt')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option.setName('attempt5')
                    .setDescription('fifth attempt')
                    .setRequired(true)
            ),
        async execute(interaction) {
            await interaction.reply(`Your average of the event ${eventname} is .... bruh idk, you have skill issue....`);
        }
    }
};