const arrayFuncs = require('./array-functions.js');

class Pool{
    constructor(message, maxPlayers, poolNumber){
        this.message = message;
        this.maxPlayers = maxPlayers;
        this.players = [];
        this.poolNumber = poolNumber;
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
        this.message.channel.send(`Aktuell sind ${this.players.length} Spieler in Pool ${this.poolNumber}`);
    }

    handleFullMatch(){
        var teamOne = [];
        var teamTwo = [];
        var shuffledPlayers = arrayFuncs.shuffle([...this.players])

        shuffledPlayers.forEach((player, i) => {
            var tag = "<@" + player + ">";
            if (i%2){
                teamOne.push(tag);
            }else{
                teamTwo.push(tag);
            }
        })

        this.message.channel.send([
            "",
            `*** TEAMS ***`,
            `Team Eins: ${teamOne.join(", ")}`,
            `**Gegen**`,
            `Team Zwei: ${teamTwo.join(", ")}`
        ]).then(() => {
            this.message.edit("Die Teams sind bereits voll!");
        });
    }
}

module.exports =
{
    Pool
}