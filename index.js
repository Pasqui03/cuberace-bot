require("dotenv").config();
const { Client, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
})

client.on('ready', () => {
    console.log('Bot is running');
    const a = new SlashCommandBuilder().setName('a').setDescription('a');
    client.application.commands.create(a);
})

client.on('interactionCreate', async interaction => {
    if(!interaction.isChatInputCommand()) return;

    if(interaction.commandName === "a"){
        await interaction.reply('a');
    }
})

client.login(process.env.CLIENT_TOKEN);