const Discord = require('discord.js');
const bot = new Discord.Client();

const Pool = require('./pool.js');
const WWGame = require('./wwgame.js');
const Randomizer = require('./randomizer.js');
const ytdl = require('ytdl-core');

const token = 'NzM3MzQzMTUxODIzNTE5ODA3.Xx7-Ug.K-_ij9LVXboI6GPcAhQmFDPI2vo';
const lowestRole = "784484964770906224";

const PREFIX = '!';

var mute = true;
var pools = [];
var wwGames = [];
var randomizer = [];
var servers = [];


bot.on('ready', () => {
    console.log('This Bot is Online');
})

bot.on('guildMemberAdd', member => {
    var role = member.guild.roles.cache.filter(role => role.id == lowestRole);
    member.roles.add(role);
})

bot.on('message', message =>{
    let args = message.content.substring(PREFIX.length).split(" ");

    {
        switch(args[0].toLowerCase()){
            case 'au':
                if (message.member.voice.channel) {
                    let channel = message.guild.channels.cache.get(message.member.voice.channel.id);
                    for (const [memberID, member] of channel.members) {
                      member.voice.setMute(mute);
                    }
                    mute = !mute;
                } else {
                    message.reply('You need to join a voice channel first!');
                }
                message.delete();
                break;
            
            case 'clear':
                message.channel.send('Funktioniert halt eh nicht');
                async ()=>{
                    await message.channel.messages.fetch().then(messages =>{
                        message.channel.bulkDelete(messages);
                    });
                }
                break;

            case 'clearvars':
                pools = [];
                wwGames = [];
                message.reply("Es wurden alle Variablen gelöscht.");
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
                message.channel.send('Biste n ADC oder was?!?');
                break;
            
            /*case 'play':

                if (!message.guild.voiceConnection) message.member.voice.channel.join()//.then(connection => {               play(connection, message);         });
                
                function play(connection, message, path){
                    var server = servers[message.guild.id];

                    server.dispatcher = connection.play(ytdl(server.queue[0]));//, {filter: "audioonly"}
                    server.queue.shift();
                    server.dispatcher.on("end", function(){
                        if (server.queue[0]){
                            play(connection, message);
                        }else{
                            connection.disconnect();
                        }
                    });
                }


                if (!args[1]){
                    message.reply(" tu mal n Link oder so da rein.");
                    return;
                }else {
                    switch(args[1]){
                        case 'luther':
                            play(connection, message, "");
                            break;
                        default:
                            message.reply(" nö das spiel ich jetzt nicht");
                            break;
                    }
                }

                if (!message.member.voice.channel){
                    message.reply("geh erst mal in nen Voice-Channel, bevor du mich hier so zu textest von der side of life!");
                    return;
                }

                if (!servers[message.guild.id]) servers[message.guild.id] = {
                    queue: []
                }

                var server = servers[message.guild.id];
                server.queue.push(args[1]);

                
                break;*/
            case 'random':
                if (!args[1]){
                    message.reply("bitte füge zumindest eine Zahl hinzu.");
                }else{
                    var randomizerSlots = parseInt(args[1]);
                    randomizerSlots = Math.max(1, randomizerSlots);
                    
                    var returnCount = 1;
                    if (args[2] != null){
                        returnCount = Math.min(randomizerSlots, parseInt(args[2]));
                    }

                    var prompText = `Es wurde ein neuer Randomizer mit ${randomizerSlots} Slots erstellt. Reagiere auf diese Nachricht, um hinzugefügt zu werden.`;
                    message.reply(prompText).then(botMsg => {
                        randomizer[botMsg.id] = new Randomizer.Randomizer(botMsg, randomizerSlots, randomizer.length+1, returnCount);
                    });
                }
                break;

            case 'roles':
                var role = message.guild.roles.cache.filter(role => role.id == lowestRole);
                onlineMembers = message.guild.members.cache.filter(member => !member.user.bot && member.roles.hoist == undefined );
                //console.log(role);
                onlineMembers.each(member => console.log(member.user.username));
                onlineMembers.each(member => member.roles.add(role));
                break;

            case 'standard':
                message.channel.send('Freaks kommen raus nach Mitternacht, Standard\nDrei Sorten Kush im Rizla, Standard\nLinks Jasmin, rechts Sabrina, Standard \nFrauen süß wie Baklava, Standard\n', {tts: true}).then(
                    message.channel.send('Shoutout David Alaba, Standard \nNur Originale, kein Duplikat, Standard \n44, 36, Altona, Standard', {tts: true})
                );
                break;
            
            case 'teams':
                var playerSlots = 0;
                if (args[1] != null){
                    playerSlots = parseInt(args[1]);
                }
                playerSlots = Math.max(2, playerSlots);
                var prompText = `Es wurde ein Matchmaking-Pool mit ${playerSlots} Slots eröffnet. Reagiere auf diese Nachricht, um hinzugefügt zu werden.`;
                message.reply(prompText).then(botMsg => {
                    pools[botMsg.id] = new Pool.Pool(botMsg, playerSlots, pools.length+1);
                });
                break;

            case 'test':
                message.reply(message.channel.id);
                break;

            case 'würg':
                message.channel.send('*würg* *würg* GIERIG GIERIG');
                break;       
            
            case 'ww':
                var playerSlots = 0;
                if (args[1] != null){
                    playerSlots = parseInt(args[1]);
                }
                playerSlots = Math.max(8, playerSlots);
                var messageAuthor = message.author
                var prompText = `Es wurde eine Runde Werwolf mit ${playerSlots} Spielern erstellt. Ihr Erzähler ist <@${messageAuthor.id}>`;
                message.channel.send(prompText).then(botMsg => {
                    wwGames[botMsg.id] = new WWGame.WW(botMsg, playerSlots, wwGames.length+1, messageAuthor);
                });
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

    var ww = wwGames[reaction.message.id];
    if (ww){
        ww.addPlayer(user.id);
    }

    var rand = randomizer[reaction.message.id];
    if (rand){
        rand.addPlayer(user.id);
    }
});

bot.login(token);