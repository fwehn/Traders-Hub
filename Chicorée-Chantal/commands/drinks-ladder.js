const fetch = require('node-fetch');

const commandData = {
    name: "ladder",
    description: "Top 10 of the Drinks-Ladder",
};

async function commandCallback(interaction){
    let drinksLadder = {
        title: "Topliste",
        description: "Hier ist die aktuelle Topliste der Trinker!\n\n-----------------------------\n",
        url: "http://traders-hub.de/drinks",
        color: 7419530,
        footer: {
            text: `Für genauere Informationen zu den Drinks besuche unsere Website!`
        },
        fields: []
    };

    return new Promise((resolve, reject) => {
        fetch(`${process.env.APILINK}/drinks/ladder`)
            .then(response => response.json())
            .then(drinksData =>{
                let drinkFields = [];
                let pos = 1;
                for (let i in drinksData){
                    let name = drinksData[i].nickname || drinksData[i].username
                    drinkFields[i] = {};
                    drinkFields[i].name = `${pos++}. ${name}`;
                    drinkFields[i].value = `${drinksData[i].totalCount} Drink(s) ~ ${drinksData[i].totalAlcohol.toFixed(3)}l Alkohol`;
                }
                drinksLadder.fields = drinkFields;
            }).then( () => {
                resolve({
                    type: "public",
                    content: {
                        embeds: [drinksLadder]
                    }
                })
            }).catch(err => {
                reject(err);
            });
    });
}

module.exports = {
    commandData, commandCallback
}