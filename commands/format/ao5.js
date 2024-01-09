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

function isDNF(avg) {
    let count = 0;
    avg.forEach(attempt => {
        if (attempt === -1) {
            count++;
        }
    })
    return count >= 2;
}

function convertSecondsToString(time){
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
            let attemptsString = [];
            for (let i = 1; i <= 5; i++) {
                attemptsString.push((interaction.options.getString(`attempt${i}`)).trim());
            }

            /*const secondRegex = /^[0-5]?\d\.\d\d$/;
            const minuteRegex = /^[0-5]?\d\:\d\d\.\d\d$/;
            const hourRegex = /^\d+\:\d\d\:\d\d\.\d\d$/;*/

            const rgx = /^((\d+\:)?[0-5]?\d\:)?[0-5]?\d\.\d\d$/

            let results = [];
            let err = false;

            attemptsString.every(async attempt => {
                let seconds = 0;
                if (rgx.test(attempt)) {
                    number = convertStringTimeToNumber(attempt);
                    if (number > 0){
                        seconds = number;
                    }else{
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
                results.push(seconds);
            })

            if (err) {
                return;
            }

            if(!isDNF(results)){
                let avg = 0;
                console.log(avg);
                results.forEach(attempt => { avg += attempt })
                avg = avg - (Math.min(...results) + Math.max(...results));
                avg /= 3;
                avg = Math.round(avg * 100) / 100 //rounds to 2 decimal digits
                time = convertSecondsToString(avg);
                await interaction.reply(`${interaction.user} did **${time}** ao5 *(best ${Math.min(...results)})* with ${eventname}`);
            }else{
                await interaction.reply(`${interaction.user} did **DNF** ao5 with ${eventname}`);
            }
        }
    }
};