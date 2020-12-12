const arrayFuncs = require('./array-functions.js');

class Randomizer{
    constructor(message, maxPlayers, randNumber, returnCount){
        this.message = message;
        this.maxPlayers = maxPlayers;
        this.randNumber = randNumber;
        this.players = [];
        this.returnCount = returnCount;
    }

    addPlayer(id){
        if (!arrayFuncs.ArraySearch(this.players, id)) {
            this.players.push(id);
            this.announcePlayerCount();
        }
        
        if (this.players.length === this.maxPlayers){
            this.handleFullMatch();
        }
    }

    announcePlayerCount(){
        this.message.channel.send(`Aktuell sind ${this.players.length} Spieler vom Randomizer ${this.randNumber} erfasst worden.`);
    }

    handleFullMatch(){
        var shuffledPlayers = arrayFuncs.shuffle([...this.players])
        var selectedPlayers = "<@" + shuffledPlayers[0] + ">";

        for (var i = 1; i < this.returnCount; i++){
            selectedPlayers = selectedPlayers + ", <@" + shuffledPlayers[i] + ">";
        }

        if (this.returnCount > 1){
            this.message.channel.send("Glückwunsch an: \n" + selectedPlayers + "\nIhr seid die Auserwählten!!!");
        }else{
            this.message.channel.send("Glückwunsch an : \n" + selectedPlayers + "\nDu wurdest auserwählt!!!");
        };
    }
};

module.exports =
{
    Randomizer
}