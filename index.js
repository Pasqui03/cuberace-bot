require("dotenv").config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, SlashCommandBuilder, Events, GatewayIntentBits } = require('discord.js');
//const firebaseConfig = require("./config.js");
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};
// Import the functions you need from the SDKs you need
const fbApp = require("firebase/app");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const app = fbApp.initializeApp(firebaseConfig);

//firebase
const { setDoc, doc, getFirestore } = require('firebase/firestore');
const db = getFirestore(app);

//prova x vedere se funzia
const data = {
    name: 'Los Angeles',
    state: 'CA',
    country: 'USA'
};

const res = async () => await await setDoc(doc(db, "cities", "new-city-id"), data);
res();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
})

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

client.commands = new Collection();

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    // Set a new item in the Collection with the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}

client.on('ready', () => {
    console.log("Logged in as " + client.user.tag);
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
})

client.login(process.env.CLIENT_TOKEN);