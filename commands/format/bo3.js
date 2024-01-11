const { SlashCommandBuilder } = require('discord.js');
const { db } = require("./../../firebase.js");
const { doc, getDoc, setDoc } = require('firebase/firestore');
const { convertStringTimeToNumber, convertNumberToStringTime } = require("../../utils/helper.js");

module.exports = (eventname) => {
    return {
        data: new SlashCommandBuilder()
            .setName(eventname)
            .setDescription(`Partecipa con evento ${eventname}`)
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
            ),
        async execute(interaction) {
            
            const docRef = doc(db, "servers", interaction.guild.id, eventname, interaction.user.id);
            const docSnap = await getDoc(docRef);

            console.log(`INSERTING RESULT BO3 (server ${interaction.guild}[${interaction.guild.id}] BY ${interaction.user})`);

            if (docSnap.exists()) {
                await interaction.reply({
                    content:
                        "You've already participated in this event.",
                    ephemeral: true
                });
                console.warn(`INSERTING ABORTED (server ${interaction.guild}[${interaction.guild.id}] BY ${interaction.user})`);
                return;
            }

            let attemptsString = [];
            for (let i = 1; i <= 3; i++) {
                attemptsString.push((interaction.options.getString(`attempt${i}`)).trim());
            }

            const rgx = /^((\d+\:)?[0-5]?\d\:)?[0-5]?\d\.\d\d$/

            let attempts = [];
            let err = false;

            attemptsString.every(async attempt => {
                let seconds = 0;
                if (rgx.test(attempt)) {
                    seconds = convertStringTimeToNumber(attempt);
                } else if (attempt.toUpperCase() == "DNF" || attempt.toUpperCase() == "DNS") {
                    seconds = attempt.toUpperCase();
                } else {
                    err = true;
                    await interaction.reply({
                        content:
                            "Wrong syntax, results should be written in these ways: ```12.34``` ```1:03.45``` ```1:00:02.99``` ```DNF``` ```DNS```",
                        ephemeral: true
                    });
                    return false; //similiar break
                }
                attempts.push(seconds);
            });

            if (err) {
                return;
            }

            let avg, best, avgStr, bestStr;
            attempts = attempts.filter(x => (x !== "DNF" && x !== "DNS"));
            if (attempts.length === 0) { //all DNF                
                avg = "DNF", best = "DNF", avgStr = "DNF", bestStr = "DNF";
            } else {
                best = Math.min(...attempts);
                bestStr = convertNumberToStringTime(best);
                avg = 0;
                if (attempts.length === 3) {
                    attempts.forEach(attempt => { avg += attempt });
                    avg /= 3;
                    avg = Math.round(avg * 100) / 100 //rounds to 2 decimal digits
                    avgStr = convertNumberToStringTime(avg);
                } else {
                    avg = "DNF", avgStr = "DNF";
                }
            }

            const data = {
                avg: avg,
                best: best
            };

            const addData = async () => await setDoc(docRef, data);
            addData();

            console.warn(`INSERTED SUCCESSFULLY (server ${interaction.guild}[${interaction.guild.id}] BY ${interaction.user})`);

            await interaction.reply(`${interaction.user} got **${bestStr}** bo3 *(mean ${avgStr})* with ${eventname}`);
        }
    }
};