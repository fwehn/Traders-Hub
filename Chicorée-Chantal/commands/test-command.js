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
    return "zeug"
}

module.exports = {
    commandData, commandCallback
}