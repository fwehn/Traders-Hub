const arrayFuncs = require('./array-functions.js');

class WW{
    constructor(message, maxPlayers, wwNumber, narrator){
        this.message = message;
        this.maxPlayers = maxPlayers;
        this.players = [];
        this.wwNumber = wwNumber;
        this.narrator = narrator;
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
        this.message.channel.send(`Aktuell sind ${this.players.length} Spieler in der Werwolfrunde ${this.wwNumber}`);
    }

    handleFullMatch(){
        var villager = [];
        var werewolfs = [];
        var seer = "";
        var shuffledPlayers = arrayFuncs.shuffle([...this.players])

        var wwCount = 2;
        if (this.maxPlayers >= 12) wws = 3;

        shuffledPlayers.forEach((player, i) => {
            if (wwCount > 0){
                werewolfs.push(player);
                wwCount--;
            }else if (seer == ""){
                seer = player;
            }else {
                villager.push(player);
            }
        });
        var playerRoles = [];
        this.message.guild.members.cache.forEach(member => {
                if (member.id == seer && !member.user.bot){
                    playerRoles.push("Seher: " + member.user.username + "\n");
                    member.send("Du bist Seher.");
                }else if (arrayFuncs.ArraySearch(werewolfs, member.id)){
                    playerRoles.push("Werwolf: " + member.user.username + "\n");
                    member.send("Du bist Werwolf.");
                }else if (arrayFuncs.ArraySearch(villager, member.id)){
                    playerRoles.push("Dorfbewohner: " + member.user.username + "\n");
                    member.send("Du bist Dorfbewohner.");
                }
        })
        playerRoles.sort();

        var narratorText = "################################################################################# \n\n Du bist **Erzähler** von **Spiel " + this.wwNumber + "** \n \n";
        for (let i = 0; i < playerRoles.length; i++){
            narratorText += playerRoles[i];
        }
        narratorText += "\n################################################################################# \n"
        this.narrator.send(narratorText);
    }
}

module.exports= {
    WW
}