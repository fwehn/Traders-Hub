const commandData = {
    name: "report",
    description: "Melde Nutzer die sich daneben benommen haben!",
    options: [
        {
            name: "user",
            description: "Wen willst du melden?",
            type: 6,
            required: true
        },
        {
            name: "reason",
            description: "Warum willst du jemanden melden?",
            type: 3,
            required: true
        }
    ]
};

function commandCallback(interaction){
    let user = interaction.member.user.id;
    let reported = interaction.data.options[0].value;
    let reason = interaction.data.options[1].value;

    return new Promise((resolve, reject) => {
        resolve({type: "channel", content: {response: `<@${reported}> wurde gemeldet!`, announcement: `**<@${user}>** hat **<@${reported}>** gemeldet!\nDer Grund dafür war:\n**${reason}**`}});
        reject(new Error('Report hat nicht Funktioniert!'));
    })
}

module.exports = {
    commandData, commandCallback
}