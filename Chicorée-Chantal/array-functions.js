const StringFunctions = require("./string-functions.js")

function shuffle(a){
    for (let i = a.length-1; i>0; i--){
        const j = Math.floor(Math.random()*(i+1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function ArraySearch(a, val){
    for (let i = 0; i < a.length; i++){
        if (a[i] === val) return true;
    }
    return false;
}

function arrayToEmbed(embed, array){
    console.log(array);
    for (let x in array){
        let item = array[x];
        let last = item[0];
        let index = 1;
        let valText = "";

        for (let y = 0; y < item.length; y++) {
            if (item[y + 1] !== last || y === item.length - 1) {
                valText = valText + "\n - " + index + " " + item[y];
                index = 1;
                last = item[y + 1];
            } else {
                index++;
            }
        }
        valText = StringFunctions.truncate(valText,1024);
        embed.addField(x, valText);
    }

    return embed;
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
    shuffle, ArraySearch, arrayToEmbed, sliceArray
}