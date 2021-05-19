fetch = require('node-fetch');

const commandData = {
    name: "prost",
    description: "Schreib dein Getränk auf!",
    options: [
        {
            name: "amount",
            description: "Menge deines Getränks!",
            type: 3,
            required: true,
            choices: [
                {name: "2cl", value: "0.02"},
                {name: "4cl", value: "0.04"},
                {name: "100ml", value: "0.1"},
                {name: "200ml", value: "0.2"},
                {name: "250ml", value: "0.25"},
                {name: "0,33l", value: "0.33"},
                {name: "0,5l", value: "0.5"},
                {name: "0,7l", value: "0.7"}
            ]
        },
        {
            name: "proof",
            description: "Alkoholgehalt deines Getränks!",
            type: 4,
            required: true,
            choices: [
                {name: "5%", value: 5},
                {name: "12%", value: 12},
                {name: "18%", value: 17},
                {name: "35%", value: 35},
                {name: "40%", value: 40},
                {name: "45%", value: 45}
            ]
        },
        {
            name: "name",
            description: "Name deines Getränks!",
            type: 3,
            required: true
        }
    ]
};

function commandCallback(interaction){
    let sendMessage = true;
    let id = "?id=" + interaction.member.user.id;
    let username = "&username=" + interaction.member.user.username;
    let nickname = "&nickname=" + interaction.member.nick;

    let options = interaction.data.options;
    let amount = "&amount=" + options[0].value;
    let proof = "&proof=" + options[1].value;
    let name = "&name=" + options[2].value;

    return new Promise((resolve, reject) => {
        if (sendMessage){
            fetch(process.env.APILINK + "/drinks/prost" + id + username + nickname + amount + proof + name, {method: 'post'})
                .then(res => res.json())
                .then(json => {
                    resolve({type: "private", content: json.response});
                }).catch(err => reject(new Error(err)));
        }else{
            resolve({type: "private", content: "Sei ehrlich!"});
        }

    })
}

module.exports = {
    commandData, commandCallback
}