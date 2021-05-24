const commandData = {
    name: "role",
    description: "Lasse einen Würfel rollen!",
    options: [
        {
            name: "dice",
            description: "Was für einen Würfel hättest du gern?",
            type: 4,
            required: true,
            choices: [
                {
                    name: "D4",
                    value: 4
                },
                {
                    name: "D6",
                    value: 6
                },
                {
                    name: "D8",
                    value: 8
                },
                {
                    name: "D10",
                    value: 10
                },
                {
                    name: "D12",
                    value: 12
                },
                {
                    name: "D20",
                    value: 20
                }
            ]
        }
    ]
};

function commandCallback(interaction){
    return new Promise((resolve, reject) => {
        resolve({type: "public", content: `Der Würfelgott hat gesprochen (D${interaction.data.options[0].value}):\n**${Math.floor(Math.random() * interaction.data.options[0].value)+1}**`});
        reject(new Error('Da gabs Probleme mit dem Role-Command!'));
    })
}

module.exports = {
    commandData, commandCallback
}