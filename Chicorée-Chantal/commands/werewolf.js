const commandData = {
    name: "werewolf",
    description: "Spielt eine Runde Werwolf!",
    options: [
        {
            name: "channel",
            description: "Mit wem möchtest du spielen?",
            type: 7,
            required: true
        },
        {
            name: "werewolfs",
            description: "Wie viele Werwölfe braucht ihr?",
            type: 4,
            required: true,
            choices: [
                {
                    name: "1",
                    value: 1
                },
                {
                    name: "2",
                    value: 2
                },
                {
                    name: "3",
                    value: 3
                },
                {
                    name: "4",
                    value: 4
                }
            ]
        },
        {
            name: "1st-role",
            description: "Welche Spezial-Rolle möchtet ihr haben?",
            type: 3,
            required: false,
        },
        {
            name: "2nd-role",
            description: "Welche Spezial-Rolle möchtet ihr haben?",
            type: 3,
            required: false,
        },
        {
            name: "3rd-role",
            description: "Welche Spezial-Rolle möchtet ihr haben?",
            type: 3,
            required: false,
        },
        {
            name: "4th-role",
            description: "Welche Spezial-Rolle möchtet ihr haben?",
            type: 3,
            required: false,
        }
    ]
};

async function commandCallback(interaction){
    const {getChannel, sendPrivateMessageToUser} = require('../index.js');
    // console.log(interaction.data.options);
    let options = interaction.data.options;
    let channel = await getChannel(options[0].value);

    return new Promise((resolve, reject) => {
        if (channel === null || channel === undefined) reject(new Error('Diesen Channel gibt es nicht auf dem Server!'));

        if (channel.type !== "voice"){
            resolve({type: "private", content: `Wähle bitte einen Voice-Channel aus!`});
        }else{
            // Get number of players and werewolfs
            let werewolfNumber= options[1].value;
            let players = [ ...channel.members.keys() ];

            // Set narrator
            let narrator = interaction.member.user.id;
            if (players.includes(narrator)){
                players.splice(players.indexOf(narrator), 1);
            }

            // Check if game is playable
            if (players.length < 5) resolve({type: "private", content: "Es tut mir leid, aber Werwolf macht erst mit mehr als 5 Leuten Spaß!"});
            if ((werewolfNumber + options.length-2) >= Math.floor(players.length * .75)) resolve({type: "private", content: `Du solltest bei dieser Spieler-Zahl weniger Werwölfe und Spezial-Rollen auswählen!`});


            // Create narrator-text
            let content = `***Rollen***\n\n`;

            // Distribute special-roles
            if (options.length > 2){
                options.splice(0, 2);
                for (let i = 0; i < options.length; i++){
                    let randomPlayer = players[Math.floor(Math.random() * players.length)];
                    players.splice(players.indexOf(randomPlayer), 1);
                    content = content + `${options[i].value}: <@${randomPlayer}>\n`;
                    sendPrivateMessageToUser(randomPlayer, `Du bist **${options[i].value}**!\n`);
                }
                content = content + `\n`;
            }

            // Distribute werewolfs
            let werewolfs = [];
            for (let i = 0; i < werewolfNumber; i++){
                let randomPlayer = players[Math.floor(Math.random() * players.length)];
                players.splice(players.indexOf(randomPlayer), 1);
                werewolfs.push(randomPlayer);
                content = content + `Werwolf: <@${randomPlayer}>\n`;
            }

            // Contact werewolfs
            for (let i = 0; i < werewolfs.length; i++){
                let otherWolfsArr = werewolfs.slice();
                otherWolfsArr.splice(otherWolfsArr.indexOf(otherWolfsArr[i]), 1);
                let otherWolfsText = "";
                for (let j = 0; j < otherWolfsArr.length; j++){
                    otherWolfsText = otherWolfsText + `<@${otherWolfsArr[j]}>\n`;
                }

                sendPrivateMessageToUser(werewolfs[i], `Du bist **Werwolf**!\nZusammen mit:\n${otherWolfsText}`);
            }
            content = content + `\n`;

            // Distribute and contact villager
            for (let i = 0; i < players.length; i++){
                sendPrivateMessageToUser(players[i], `Du bist **Dorfbewohner**!\n`);
                content = content + `Dorfbewohner: <@${players[i]}>\n`;
            }

            resolve({type: "private", content: content});
        }
    });
}

module.exports = {
    commandData, commandCallback
}