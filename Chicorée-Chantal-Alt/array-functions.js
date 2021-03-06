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

function compareArrayOfObjectsByFieldTotal( a, b ) {
    if ( a.total < b.total ){
        return -1;
    }
    if ( a.total > b.total ){
        return 1;
    }
    return 0;
}

function compareArrayOfObjectsByFieldDaily( a, b ) {
    if ( a.daily < b.daily ){
        return -1;
    }
    if ( a.daily > b.daily ){
        return 1;
    }
    return 0;
}

function compareArrayOfObjectsByFieldDate( a, b ){
    let newDate1 = new Date(a.date).getTime();
    let newDate2 = new Date(b.date).getTime();

    if ( newDate1 < newDate2 ){
        return -1;
    }
    if ( newDate1  > newDate2 ){
        return 1;
    }
    return 0;
}

module.exports = {
    shuffle, ArraySearch, arrayToEmbed, sliceArray, compareArrayOfObjectsByFieldTotal, compareArrayOfObjectsByFieldDaily, compareArrayOfObjectsByFieldDate
}