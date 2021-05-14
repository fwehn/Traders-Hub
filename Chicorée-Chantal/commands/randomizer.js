const commandData = {
    name: "randomize",
    description: "Ein kleiner Randomizer!",
    options: [
        {
            name: "picks",
            description: "Wie viele Personen sollen ausgewählt werden?",
            type: 4,
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
                },
                {
                    name: "5",
                    value: 5
                }
            ],
            required: true
        },
        {
            name: "user1",
            description: "Wähle einen User aus!",
            type: 6,
            required: true
        },
        {
            name: "user2",
            description: "Wähle einen User aus!",
            type: 6,
            required: false
        },
        {
            name: "user3",
            description: "Wähle einen User aus!",
            type: 6,
            required: false
        },
        {
            name: "user4",
            description: "Wähle einen User aus!",
            type: 6,
            required: false
        },
        {
            name: "user5",
            description: "Wähle einen User aus!",
            type: 6,
            required: false
        },
        {
            name: "user6",
            description: "Wähle einen User aus!",
            type: 6,
            required: false
        },
        {
            name: "user7",
            description: "Wähle einen User aus!",
            type: 6,
            required: false
        },
        {
            name: "user8",
            description: "Wähle einen User aus!",
            type: 6,
            required: false
        },
        {
            name: "user9",
            description: "Wähle einen User aus!",
            type: 6,
            required: false
        },
        {
            name: "user10",
            description: "Wähle einen User aus!",
            type: 6,
            required: false
        }
    ]
};

function commandCallback(interaction){
    // console.log(interaction);
    let options = interaction.data.options;
    let picks = options[0].value;
    options.shift();
    let pickedPlayer = [];
    let content = `Der Randomizer hat gesprochen!\nAusgewählt wurde(n):\n\n`;

    if (picks >= options.length) picks = 1;

    for (let i = 0; i < picks; i++){
        let randomIndex = Math.floor(Math.random() * options.length);
        pickedPlayer.push(options[randomIndex]);
        options.splice(randomIndex, 1);
    }

    for (let i = 0; i < pickedPlayer.length; i++){
        content = content + `<@${pickedPlayer[i].value}>\n`
    }

    return new Promise((resolve, reject) => {
        resolve({type: "public",content: content});
        reject(new Error('Da gabs Probleme mit dem TestCommand!'));
    })
}

module.exports = {
    commandData, commandCallback
}