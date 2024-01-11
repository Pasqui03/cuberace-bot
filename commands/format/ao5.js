const { SlashCommandBuilder } = require('discord.js');
const { db } = require("./../../firebase.js");
const { doc, getDoc, setDoc } = require('firebase/firestore');
const { convertStringTimeToNumber, isAvgDNF, convertNumberToStringTime } = require("../../utils/helper.js");

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

            const docRef = doc(db, "servers", interaction.guild.id, eventname, interaction.user.id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                await interaction.reply({
                    content:
                        "You've already participated in this event.",
                    ephemeral: true
                });
                return;
            }

            let attemptsString = [];
            for (let i = 1; i <= 5; i++) {
                attemptsString.push((interaction.options.getString(`attempt${i}`)).trim());
            }

            /*const secondRegex = /^[0-5]?\d\.\d\d$/;
            const minuteRegex = /^[0-5]?\d\:\d\d\.\d\d$/;
            const hourRegex = /^\d+\:\d\d\:\d\d\.\d\d$/;*/

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
            if (!isAvgDNF(attempts)) {
                avg = 0;
                attempts = attempts.filter(x => (x !== "DNF" && x !== "DNS"))
                attempts.forEach(attempt => { avg += attempt });
                avg = avg - (Math.min(...attempts) + Math.max(...attempts));
                avg /= 3;
                avg = Math.round(avg * 100) / 100 //rounds to 2 decimal digits
                avgStr = convertNumberToStringTime(avg);
                best = Math.min(...attempts);
                bestStr = convertNumberToStringTime(best);
            } else {
                avg = "DNF", avgStr = "DNF";
                if (attempts.filter(x => (x !== "DNF" && x !== "DNS")).length === 0) {
                    best = "DNF", bestStr = "DNF";
                } else {
                    best = Math.min(...attempts.filter(x => (x !== "DNF"  && x !== "DNS")));
                    bestStr = convertNumberToStringTime(best);
                }
            }

            const data = {
                avg: avg,
                best: best
            };

            const addData = async () => await setDoc(docRef, data);
            addData();

            await interaction.reply(`${interaction.user} got **${avgStr}** ao5 *(best ${bestStr})* with ${eventname}`);
        }
    }
};