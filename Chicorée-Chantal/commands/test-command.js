const commandData = {
    name: "test",
    description: "Das ist ein Test-Command",
    options: [
        {
            name: "user",
            description: "Test User!",
            type: 6,
            required: true
        }
    ]
};

function commandCallback(interaction){
    console.log(interaction)
    return {
        type: "public",
        content: `${interaction.data.name}`
    };
}

module.exports = {
    commandData, commandCallback
}