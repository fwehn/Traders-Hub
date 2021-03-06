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
        let villager = [];
        let werewolfs = [];
        let seer = "";
        let shuffledPlayers = arrayFuncs.shuffle([...this.players])

        let wwCount = 2;
        if (this.maxPlayers >= 12) wwCount = 3;

        shuffledPlayers.forEach((player) => {
            if (wwCount > 0){
                werewolfs.push(player);
                wwCount--;
            }else if (seer === ""){
                seer = player;
            }else {
                villager.push(player);
            }
        });
        let playerRoles = [];
        this.message.guild.members.cache.forEach(member => {
                if (member.id === seer && !member.user.bot){
                    playerRoles.push("**Seher**: " + member.user.username + "\n");
                    member.send("Du bist **Seher**.");
                }else if (arrayFuncs.ArraySearch(werewolfs, member.id)){
                    playerRoles.push("**Werwolf**: " + member.user.username + "\n");
                    let promtext = "Du bist **Werwolf**.";

                    // for (let i in werewolfs){
                    //     if (werewolfs[i] !== member.id){
                    //         let other = this.message.guild.members.cache.filter(member => member.id === werewolfs[i]);
                    //         console.log(other.values().next());
                    //         //other.forEach(member => promtext = promtext + "\n" + other.user.username);
                    //         //promtext = promtext + "\n" + other.user.username;
                    //     }
                    // }


                    member.send(promtext);
                }else if (arrayFuncs.ArraySearch(villager, member.id)){
                    playerRoles.push("**Dorfbewohner**: " + member.user.username + "\n");
                    member.send("Du bist **Dorfbewohner**.");
                }
        })
        playerRoles.sort();

        let narratorText = "################################################################################# \n\n Du bist **Erzähler** von **Spiel " + this.wwNumber + "** \n \n";
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