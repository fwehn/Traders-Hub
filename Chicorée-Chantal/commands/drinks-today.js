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

    let resolveData = {
        type: "private",
        content: "Heute wurde noch nichts getrunken!\nAlso halt dich ran!"
    };

    return new Promise((resolve, reject) => {
        fetch(`${process.env.APILINK}/drinks/today`)
            .then(response => response.json())
            .then(data =>{
                console.log(data)
                console.log(Object.keys(data).length)
                if (Object.keys(data).length !== 0){
                    let dataArray = createArrayFromObject(data);
                    dataArray.sort(function (a,b){
                        if (a.value.alcoholAmount >= b.value.alcoholAmount) return -1;
                        if (a.value.alcoholAmount < b.value.alcoholAmount) return 1;
                        return 0;
                    });

                    //Organize incoming Data

                    let fields = [];
                    let drinks = dataArray;
                    let total = getTotalAmount(dataArray);
                    let description;
                    let leader = getDrinksLeader(dataArray);
                    let bestAmount = dataArray[0].value.alcoholAmount;

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

                    description = description + `die Führung mit ** ${bestAmount}l** Alkohol!!!\nHier ist ne genaue Auflistung aller Drinks:\n\n`
                    description = description.substring(0, 2048);
                    drinksEmbeds[0].description = description;

                    //Create Embed-Fields
                    for (let i = 0; i < drinks.length; i++){
                        let drinksString = getDrinksAsString(drinks[i].value.drinks);

                        if (drinksString.length > 1024) drinksString = `${drinksString.substring(0, 1020)} ...`

                        fields[i] = {name: drinks[i].key.substring(0, 256), value: drinksString};
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
                        drinksEmbeds[0].footer.text = `Insgesamt wurde heute ${total}l reiner Alkohol getrunken!`;
                        drinksEmbeds[0].fields = fields;
                    }

                    resolveData = {
                        type: "public",
                        content: {
                            embeds: drinksEmbeds
                        }
                    };
                }
            }).then( () => {
                resolve(resolveData)
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

function createArrayFromObject(data){
    let arrayData = []
    for (let i in data){
        arrayData.push({key: i, value: data[i]})
    }

    return arrayData;
}

function getDrinksLeader(sortedArray){
    let max = sortedArray[0].value.alcoholAmount;
    let leader = [];

    for (let i = 0; i<sortedArray.length; i++){
        if (sortedArray[i].value.alcoholAmount < max) return leader;

        leader.push(sortedArray[i].key);
    }

    return leader;
}

function getTotalAmount(array){
    let value = 0;
    for (let i = 0; i < array.length; i++){
        value += array[i].value.alcoholAmount;
    }

    return value;
}

function getDrinksAsString(array){
    let stringFromArray = "";
    for (let i = 0; i<array.length; i++){
        let drink = array[i].split("|");
        stringFromArray = stringFromArray + `${parseFloat(drink[1]).toFixed(2)}l ${drink[2]}, `;
    }
    stringFromArray = stringFromArray.substring(0, stringFromArray.length - 2)
    return stringFromArray;
}

module.exports = {
    commandData, commandCallback
}