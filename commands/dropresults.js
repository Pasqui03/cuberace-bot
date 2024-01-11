const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { db } = require('./../firebase.js');

const { doc, collection, deleteDoc, getDocs } = require('firebase/firestore');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dropresults')
        .setDescription('drop all results to restart the race and give the role to the winners'),
    async execute(interaction) {

        if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const events = ["333", "222", "444", "555", "666", "777", "clock", "mega", "pyra", "skewb", "sq1", "3bld", "4bld", "5bld"];
            events.forEach(async (event) => {
                const querySnapshot = await getDocs(collection(db, "servers", interaction.guild.id, event));
                querySnapshot.forEach(async (document) => {
                    // doc.data() is never undefined for query doc snapshots
                    await deleteDoc(doc(db, "servers", interaction.guild.id, event, document.id));
                    console.log(`DELETED: servers/${interaction.guild.id}/${event}/${document.id}`)
                    console.log(document.id, " => ", document.data());
                });
            })
            console.warn(`ALL DOCUMENT ARE DELETED SUCCESSFULLY (server ${interaction.guild.id})`);
            await interaction.reply("All results have been deleted. You can race again!");
        } else {
            await interaction.reply({
                content:
                    "You are not authorized to execute this command.",
                ephemeral: true
            });
        }
    },
};