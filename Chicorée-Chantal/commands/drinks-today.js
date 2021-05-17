const fetch = require("node-fetch");

const commandData = {
    name: "drinks",
    description: "Alle Drinks von Heute!",
};

function commandCallback(interaction){

    let drinksEmbeds = [{
        title: "Drinks",
        description: "",
        url: "http://traders-hub.de/drinks",
        color: 7419530,
        footer: {},
        fields: []
    }];


    return new Promise((resolve, reject) => {
        fetch(`${process.env.APILINK}/drinks/today`)
            .then(response => response.json())
            .then(data =>{
                //Organize incoming Data
                let fields = [];
                let drinks = data.drinks;   // [{name: "1", drinks: "3 Peddas"]
                let total = data.total;     // 3
                let description = "";       // ["1"]
                let leader = data.leader;
                let bestCount = data.bestCount;

                //Create Embed-Description
                if (leader.length <= 1){
                    description = `Derzeit behält ** ${leader[0]} **`
                }else{
                    description = `Derzeit behalten `
                    let separator = " ";
                    for (let i = 0; i < leader.length; i++){
                        if (i > 0) separator = `, `
                        if (i === leader.length-1) separator = ` und `

                        description = description + separator + `** ${leader[i]} **`
                    }
                }

                description = description + `die Führung mit ** ${bestCount} ** Drinks!!!\nHier ist ne genaue Auflistung aller Drinks:\n\n`
                description = description.substring(0, 2048);
                drinksEmbeds[0].description = description;

                //Create Embed-Fields
                for (let i = 0; i < drinks.length; i++){
                    fields[i] = {name: drinks[i].name.substring(0, 256), value: drinks[i].drinks.substring(0, 1024)};
                }
                //Check the Embed-Limitations by Discord
                let maxFieldCount = 25;
                if (fields.length > maxFieldCount){
                    let overhang = (fields.length%maxFieldCount);
                    let slices = (fields.length-overhang)/maxFieldCount;

                    //First
                    drinksEmbeds[0].fields = sliceArray(fields, 0, maxFieldCount-1);
                    //2nd ... N-1
                    for (let i = 1; i < slices; i++){
                        drinksEmbeds[i] = {
                            color: 7419530,
                            fields: sliceArray(fields, maxFieldCount*i, maxFieldCount*(i+1)-1)
                        }
                    }
                    //Last
                    drinksEmbeds[slices] = {
                        color: 7419530,
                        fields: sliceArray(fields, maxFieldCount*slices, maxFieldCount*slices+overhang),
                        footer: {
                            text: `Insgesamt wurden bereits ${total} Drinks getrunken!!!`
                        }
                    }
                }else{
                    drinksEmbeds[0].footer.text = `Insgesamt wurden heute ${total} Drinks getrunken!`;
                    drinksEmbeds[0].fields = fields;
                }

            }).then( () => {
                resolve({
                    type: "public",
                    content: {
                        embeds: drinksEmbeds
                    }
                })
            }).catch(err => {
                reject(err);
            });
    });
}

function sliceArray(array , begin, end){
    let current = 0;
    let arrayOut = [];
    for (let i in array){
        if (current >= begin && current <= end){
            arrayOut[i] = array[i];
        }
        current++;
    }
    return arrayOut;
}



module.exports = {
    commandData, commandCallback
}