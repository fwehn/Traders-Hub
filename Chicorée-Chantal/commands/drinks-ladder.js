const fetch = require('node-fetch');

const commandData = {
    name: "ladder",
    description: "Top 10 of the Drinks-Ladder",
};

async function commandCallback(interaction){

    let yesterday = new Date();
    // new Date().toISOString().split("T")[0] + "T23:59:59")
    yesterday.setDate(yesterday.getDate() - 1);

    yesterday = new Date(yesterday.toISOString().split("T")[0] + "T23:59:59");

    let drinksLadder = {
        "title": "Topliste",
        "description": "Hier ist die aktuelle Topliste der Trinker!\n\n-----------------------------\n",
        "url": "http://traders-hub.de/drinks",
        "color": 7419530,
        "footer": {
            "text": `Für genauere Informationen zu den Drinks besuche unsere Website!\nStand: ${yesterday.toString().split("G")[0]} Uhr`
        },
        "fields": []
    };

    return new Promise((resolve, reject) => {
        fetch(`${process.env.APILINK}/drinks/ladder`)
            .then(response => response.json())
            .then(drinksData =>{
                let drinkFields = [];
                let pos = 1;
                for (let i in drinksData){
                    drinkFields[i] = {};
                    drinkFields[i].name = `${pos++}. ${drinksData[i].name}`;
                    drinkFields[i].value = `${drinksData[i].total} Drink(s)`;
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