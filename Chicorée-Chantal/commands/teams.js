const commandData = {
    name: "teams",
    description: "Lasse dir Teams zusammen würfeln!",
    options: [
        {
            name: "number",
            description: "Wie viele Teams braucht ihr?",
            type: 4,
            required: true,
            choices: [
                {
                    name: "2 Teams",
                    value: 2
                },
                {
                    name: "3 Teams",
                    value: 3
                },
                {
                    name: "4 Teams",
                    value: 4
                }
            ]
        },
        {
            name: "channel",
            description: "Aus welchem Channel willst su ein Team bauen?",
            type: 7,
            required: true
        }
    ]
};

async function commandCallback(interaction){
    const {getChannel} = require('../index.js');
    let channel = await getChannel(interaction.data.options[1].value);

    return new Promise((resolve, reject) => {
        if (channel === null || channel === undefined) reject(new Error('Diesen Channel gibt es nicht auf dem Server!'));

        if (channel.type !== "voice"){
            resolve({type: "private", content: `Wähle bitte einen Voice-Channel aus!`});
        }else{
            let content = `***TEAMS***`;
            let teamNumber= interaction.data.options[0].value;
            let players = [ ...channel.members.keys() ];
            let overhang = players.length%teamNumber;
            let playerPerTeam = (players.length-overhang)/teamNumber;

            for (let x = 0; x < teamNumber; x++){
                let thisTeamPlayerCount = playerPerTeam;
                if (x < overhang) thisTeamPlayerCount++;
                content = content + `\nTeam ${x+1}:\n`;
                for (let y = 0; y < thisTeamPlayerCount; y++){
                    let randomPlayerNumber = Math.floor(Math.random() * players.length);
                    let player = players[randomPlayerNumber];
                    players.splice(randomPlayerNumber, 1);

                    content = content + `<@${player}>, `;
                }
                content = content.substring(0, content.length - 2);
            }
            resolve({type: "public", content: content});
        }
    });
}

module.exports = {
    commandData, commandCallback
}