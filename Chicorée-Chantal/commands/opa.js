const fetch = require('node-fetch');

const commandData = {
    name: "opa",
    description: "Eine Weisheit fürs Leben!",
};

function commandCallback(interaction){

    return new Promise((resolve, reject) => {
        fetch(`${process.env.APILINK}/opa`)
            .then(response => response.json())
            .then( (res) => {
                console.log(res);
                resolve({
                    type: "public",
                    content: res.sentence
                })
            }).catch(err => {
            reject(err);
        });
    });
}

module.exports = {
    commandData, commandCallback
}