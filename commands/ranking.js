const { SlashCommandBuilder } = require('discord.js');
const { db } = require('./../firebase.js');

const { collection, getDocs, query, orderBy } = require('firebase/firestore');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ranking')
        .setDescription('Show the ranking of cubing race'),
    async execute(interaction) {

        const events = ["333", "222", "444", "555", "666", "777", "clock", "mega", "pyra", "skewb", "sq1", "3bld", "4bld", "5bld"];
        let r = 0;
        let table = "# Ranking\n";

        async function fetchData() {
            for (const event of events) {
                const resultsRef = collection(db, "servers", interaction.guild.id, event);
                let q = null;
                if(event == "3bld" || event == "4bld" || event == "5bld"){
                    q = query(resultsRef, orderBy("best"), orderBy("avg"));
                }else{
                    q = query(resultsRef, orderBy("avg"), orderBy("best"));
                }
                
                try {
                    const querySnapshot = await getDocs(q);
                    
                    datas = "";
                    const eventPromises = querySnapshot.docs.map(async (doc) => {
                        r++;
                        const data = doc.data();
                        if(event == "3bld" || event == "4bld" || event == "5bld"){
                            datas += `${r}. <@${doc.id}> with a best of ${data.best} (mean of ${data.avg})\n`;
                        }else{
                            datas += `${r}. <@${doc.id}> with an average of ${data.avg} (best of ${data.best})\n`;
                        }
                    });

                    // Wait for all async operations for the current event to complete
                    await Promise.all(eventPromises);
                    if(datas !== ""){
                        table += `## ${event}\n${datas}\n`;
                        datas = "";
                    }
                    r = 0;
                } catch (error) {
                    console.error("Error fetching data for event", event, ":", error);
                }
            };

            // Now all asynchronous operations have completed
            await interaction.reply(table);
        }

        // Call the asynchronous function
        fetchData();
    },
};