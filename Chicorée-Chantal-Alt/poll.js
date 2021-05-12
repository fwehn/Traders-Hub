class Poll {
    constructor(message, entries, entryCount){
        this.message = message;
        this.players = [];
        this.entries = entries;
        this.entryCount = entryCount;
    }

    addPlayer(id, vote){
        console.log(vote);
        this.players[id] = vote;
        console.log(typeof this.players)
    }

    getResult(){
        let votings = [];
        for (let player in this.players){
            votings.push(this.players[player]);
        }
        votings.sort((a,b) => {return a - b});

        //TODO(Count through the array and pick the highest votings)


        let winnerIndicies = [];

        let winner = [];
        let winnerIterator = 1;

        for (let entry in this.entries){
            if (winnerIndicies.includes(winnerIterator)){
                winner.push(this.entries.entries);
            }
        }

        return winner;
    }

    getEntryCount(){
        return this.entryCount;
    }
}

module.exports =
{
    Poll
}