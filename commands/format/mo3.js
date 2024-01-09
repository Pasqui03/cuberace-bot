const { SlashCommandBuilder } = require('discord.js');

function convertStringTimeToNumber(str) {
    arr = str.split(":");
    arr.reverse();
    seconds = Number(arr[0]);
    for (let i = 1; i < arr.length; i++) {
        seconds += Number(arr[i]) * (60 * i);
    }
    return seconds;
}

function convertSecondsToString(time) {
    const date = new Date(null);
    date.setMilliseconds(time * 1000);
    return date.toISOString().substr(11, 11).replace(/^[0:]*(?!\.)/g, '');
}

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
            ),
        async execute(interaction) {
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
                    number = convertStringTimeToNumber(attempt);
                    if (number > 0) {
                        seconds = number;
                    } else {
                        err = true
                        await interaction.reply({
                            content:
                                "All your attempts must be greater than 0.",
                            ephemeral: true
                        });
                    }
                } else if (attempt.toUpperCase() == "DNF" || attempt.toUpperCase() == "DNS") {
                    seconds = -1;
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
            })

            if (err) {
                return;
            }

            attempts = attempts.filter(attempt => attempt !== -1);
            if (attempts.length <= 2) { //at least 1 DNF
                await interaction.reply(`${interaction.user} did DNF mo3 with ${eventname}`);
            } else {
                let min = Math.min(...attempts);
                min = convertSecondsToString(min);
                let mean = 0;
                attempts.forEach(attempt => { mean += attempt });
                mean /= 3;
                mean = Math.round(mean * 100) / 100 //rounds to 2 decimal digits
                time = convertSecondsToString(mean);
                await interaction.reply(`${interaction.user} did **${time}** mo3 *(best ${min})* with ${eventname}`);
            }
        }
    }
};