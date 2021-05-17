const commandData = {
    name: "submit",
    description: "Schlage einen Satz für unsere Commands vor!",
    options: [
        {
            name: "type",
            description: "Welche Art von Satz möchtest du vorschlagen?",
            type: 3,
            required: true,
            choices: [
                {
                    name: "opa",
                    description: "Ein Satz für den Opa-Command!",
                    value: "Opa"
                },
                {
                    name: "prost",
                    description: "Ein Satz für den Prost-Command!",
                    value: "Prost"
                }
            ]
        },
        {
            name: "sentence",
            description: "Wie lautet der Satz?",
            type: 3,
            required: true
        }
    ]
};

function commandCallback(interaction){
    let user = interaction.member.user.id;
    let type = interaction.data.options[0].value;
    let sentence = interaction.data.options[1].value;

    return new Promise((resolve, reject) => {
        resolve({type: "channel", content: {response: `Vielen Dank, für die Einreichung!`, announcement: `**<@${user}>** hat folgenden **${type}**-Satz eingereicht:\n**${sentence}**`}});
        reject(new Error('Report hat nicht Funktioniert!'));
    })
}

module.exports = {
    commandData, commandCallback
}