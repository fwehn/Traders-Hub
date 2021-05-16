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
    return new Promise((resolve, reject) => {
        resolve({type: "public",content: `${interaction.data.name}`});
        reject(new Error('Da gabs Probleme mit dem TestCommand!'));
    })
}

module.exports = {
    commandData, commandCallback
}