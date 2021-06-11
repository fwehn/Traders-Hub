const commandData = {
    name: "poll",
    description: "Hiermit kannst du eine Abstimmung starten!",
    options: [
        {
            name: "topic",
            description: "Was ist der Grund für diese Abstimmung?",
            type: 3,
            required: true
        },
        {
            name: "choice1",
            description: "Erste Auswahlmöglichkeit!",
            type: 3,
            required: true
        },
        {
            name: "choice2",
            description: "Zweite Auswahlmöglichkeit!",
            type: 3,
            required: true
        },
        {
            name: "choice3",
            description: "Dritte Auswahlmöglichkeit!",
            type: 3,
            required: false
        },
        {
            name: "choice4",
            description: "Vierte Auswahlmöglichkeit!",
            type: 3,
            required: false
        },
        {
            name: "choice5",
            description: "Fünfte Auswahlmöglichkeit!",
            type: 3,
            required: false
        }
    ]
};

function commandCallback(interaction){
    const options = interaction.data.options;
    let responseText = `**Poll**: *${options[0].value}*\n`;
    options.shift();

    return new Promise((resolve, reject) => {

        if (options === undefined || options === null){
            reject(new Error('Da gabs Probleme mit dem TestCommand!'));
        }

        for (let i = 0; i < options.length; i++){
            responseText = responseText + `[${i+1}] ${options[i].value}\n`;
        }

        resolve({type: "poll", content: responseText, options: options.length});

    })
}

module.exports = {
    commandData, commandCallback
}