const Discord = require('discord.js');
const bot = new Discord.Client();

const token = 'NzM3MzQzMTUxODIzNTE5ODA3.Xx7-Ug.K-_ij9LVXboI6GPcAhQmFDPI2vo';

const PREFIX = '!';

var pools = [];
class Pool{
    constructor(message, maxPlayers){
        this.message = message;
        this.maxPlayers = maxPlayers;
        this.players = [];
    }

    addPlayer(id){
        this.players.push(id);
        this.announcePlayerCount();

        if (this.players.length === this.maxPlayers){
            this.handleFullMatch();
        }
    }

    announcePlayerCount(){
        this.message.channel.send(`Aktuell sind ${this.players.length} Spieler im Pool`);
    }

    handleFullMatch(){
        var teamOne = [];
        var teamTwo = [];
        var shuffledPlayers = shuffle([...this.players])

        shuffledPlayers.forEach((player, i) => {
            var tag = "<@" + player + ">"
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
            this.message.edit("Die Teams sind bereits voll!")
            delete pools[this.message.id];
        });
    }
}

function shuffle(a){
    for (let i = a.length-1; i>0; i--){
        const j = Math.floor(Math.random()*(i+1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

bot.on('ready', () => {
    console.log('This Bot is Online');
})

bot.on('message', message =>{
    let args = message.content.substring(PREFIX.length).split(" ");

    {
        switch(args[0].toLowerCase()){
            case 'calle':
                message.channel.send('Ah, Yes, the Calle, da sach ich nur callepupalle, ALLA!');
                break;

            case 'clear':
                message.channel.send('Verstanden');
                async ()=>{
                    await message.channel.messages.fetch().then(messages =>{
                        message.channel.bulkDelete(messages);
                    });
                }
                break;

            case 'ehre':
                message.reply('ja EHRE ALLA!');
                break;

            case 'hello':
                message.channel.send('Hi');
                break;
            
            case 'luther':
                message.channel.send('Luther! Luther! Wer ist Luther?!? MARTIN LUTHER!!!\nhttps://www.youtube.com/watch?v=AOEQrKk6AZ4');
                break;

            case 'mimimi':
                message.channel.send('Das ist das Geräusch das der Stein immer macht.');
                break;

            case 'schande':
                message.channel.send('schande, schande, schande');
                break;
            
            case 'standard':
                message.channel.send('Freaks kommen raus nach Mitternacht, Standard\nDrei Sorten Kush im Rizla, Standard\nLinks Jasmin, rechts Sabrina, Standard \nFrauen süß wie Baklava, Standard \nShoutout David Alaba, Standard \nNur Originale, kein Duplikat, Standard \n44, 36, Altona, Standard');
                break;
            
            case 'teams':
                var playerSlots = 4;
                if (args[1] != null){
                    playerSlots = parseInt(args[1]);
                }
                var prompText = `Es wurde ein Matchmaking-Pool mit ${playerSlots} Slots eröffnet. Reagiere auf diese Nachricht, um hinzugefügt zu werden.`;
                message.reply(prompText).then(botMsg => {
                    pools[botMsg.id] = new Pool(botMsg, playerSlots);
                });
                break;

            case 'test':
                message.reply('args[1] = ' + args[1]);
                break;

            case 'verstanden':
                message.reply('hömmal du H***sohn, willste mir jetzt auch noch meine Arbeit wegnehmen oder was?!?!');
                break;

            case 'würg':
                message.channel.send('*würg* *würg* GIERIG GIERIG');
                break;            
        }
    }
})

bot.on('messageReactionAdd', async(reaction, user) => {
    if (reaction.partial){
        try{
            await reaction.fetch();
        }catch(error){
            console.log('Something went wrong when fetching the message: ', error);
            return;
        }
    }
    var pool = pools[reaction.message.id];
    if (pool){
        pool.addPlayer(user.id);
    }
});

bot.login(token);