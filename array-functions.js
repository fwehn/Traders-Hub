function shuffle(a){
    for (let i = a.length-1; i>0; i--){
        const j = Math.floor(Math.random()*(i+1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function ArraySearch(a, val){
    for (let i = 0; i < a.length; i++){
        if (a[i] == val) return true;
    }
    return false;
}

module.exports = {
    shuffle, ArraySearch
}