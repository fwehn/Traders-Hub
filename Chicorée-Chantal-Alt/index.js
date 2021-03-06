console.log("satrting...");

const Discord = require('discord.js');
const bot = new Discord.Client();

const fetch = require('node-fetch');
const Bluebird = require('bluebird');

fetch.Promise = Bluebird;

const fs = require('file-system');
const Pool = require('./pool.js');
const Poll = require('./poll.js');
const WWGame = require('./wwgame.js');
const Randomizer = require('./randomizer.js');
const ArrayFunctions = require('./array-functions.js');
const api = require('./api.js');
const cron = require('node-cron');


api.startUp();

const rawdata = fs.readFileSync('./variables.json');
const variables = JSON.parse(rawdata);
const token = variables.token;
const PREFIX = variables.prefix;

const jesseID = variables.jesse;

const feedbackSentences = fs.readFileSync('./txt-files/saufantworten.txt', 'utf-8').split('\n');

const lowestRole = variables.lowestRole;
const saufChannelId = variables.saufChannelId;

var mute = true;
var pools = [];
var wwGames = [];
var randomizer = [];
var gesoffen = [];
var servers = [];
var prostListe = [];
var polls = [];

console.log("waiting for discord...");

cron.schedule('59 21 * * *', function() {
    api.saveDrinks(prostListe, bot.guilds.cache.get(variables.guild).members.cache).then(() => {
        prostListe = [];
        console.log("Cron-Job done!");
    });

});

cron.schedule('50 * * * *', function(){
    api.updateNicknames(bot.guilds.cache.get(variables.guild).members.cache).then(console.log('Nicknames updated!'));
});

bot.on('ready', () => {
    console.log('This Bot is Online');
})

bot.on('guildMemberAdd', member => {
    var role = member.guild.roles.cache.filter(role => role.id == lowestRole);
    member.roles.add(role);
})

bot.on('message', message =>{
    if (message.author.bot || message.toString().indexOf("!") != 0) return;
    let args = message.content.substring(PREFIX.length).split(" ");

    {
        switch(args[0].toLowerCase()){
            case 'test':
                // message.reply(message.channel.id + " test " + message.member.voice.channel )
                console.log([2,3,1,5,12,41,1,23]);
                break;

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

            case 'chuck':
                fetch('https://api.chucknorris.io/jokes/random')
                    .then(res => res.json())
                    .then(json => message.channel.send('**Did you know?**\n' + json.value));
                break;
            
            case 'clear':
                message.channel.send('Funktioniert halt eh nicht');
                async ()=>{
                    await message.channel.messages.fetch().then(messages =>{
                        message.channel.bulkDelete(messages);
                    });
                }
                break;

            case 'cleardrinks':
                prostListe = [];
                break;

            case 'clearvars':
                pools = [];
                wwGames = [];
                randomizer = [];
                servers = [];
                message.reply("Es wurden alle Variablen gelöscht.");
                break;

            case 'closepoll':
                if (!polls[args[1]]){
                    message.reply("es gibt leider keinen Poll mit dieser ID!\nCheck vielleicht nochmal welche ID ich dir gesendet hab!");
                    return;
                }

                console.log(polls[args[1]].getResult());
                break;

            case 'drinks':
                let fieldLength = 25;
                let best = "";
                let totalBest = 0;
                let total = 0;

                let currentMembers = message.guild.members.cache;
                let formattedProstListe = [];

                let prostListeLength = 0;

                for (let i in prostListe){
                    formattedProstListe[currentMembers.get(i).user.username] = prostListe[i];
                }

                for (let i in formattedProstListe){
                    let current = 0;
                    for (let j in formattedProstListe[i]){
                        total++;
                        current++;
                    }

                    if (current > totalBest){
                        best = i;
                        totalBest = current;
                    }



                    prostListeLength++;
                }
                // console.log(prostListeLength);

                let dataFrist = {
                    "title": "Drinks",
                    "description": `Derzeit behält **${best}** die Führung mit **${totalBest}** Drinks!!!\nHier ist ne genaue Auflistung aller Drinks:\n\n`,
                    "url": "http://traders-hub.de/veggie-gang/#chicor%C3%A9e-chantal",
                    "color": 7419530,
                };
                let embed = []
                embed[0] = new Discord.MessageEmbed(dataFrist);

                if (prostListeLength > fieldLength){
                    let overhang = (prostListeLength%fieldLength);
                    let slices = (prostListeLength-overhang)/fieldLength;

                    embed[0] = ArrayFunctions.arrayToEmbed(embed[0], ArrayFunctions.sliceArray(formattedProstListe, 0, fieldLength-1));
                    for (let i = 1; i < slices;i++){
                        embed[i] = ArrayFunctions.arrayToEmbed(new Discord.MessageEmbed({"color": 7419530}), ArrayFunctions.sliceArray(formattedProstListe,fieldLength*i, fieldLength*(i+1)-1));
                    }
                    embed[slices] = ArrayFunctions.arrayToEmbed(new Discord.MessageEmbed({"color": 7419530}), ArrayFunctions.sliceArray(formattedProstListe,fieldLength*slices, fieldLength*slices+overhang));
                    embed[slices].setFooter(`Insgesamt wurden bereits ${total} Drinks getrunken!!!`);
                }else{
                    embed[0] = ArrayFunctions.arrayToEmbed(embed[0], formattedProstListe);
                    embed[0].setFooter(`Insgesamt wurden bereits ${total} Drinks getrunken!!!`);
                }

                for (let i in embed){
                    message.channel.send(embed[i])
                }
                break;

            case 'ehre':
                message.reply('ja EHRE ALLA!');
                break;

            case 'hello':
                message.channel.send('Hi');
                break;

            case 'help':
                let data = {
                    "title": "Commands",
                    "description": "Hallo, ich bin Chicorée-Chantal.\nIch bin ein mehr oder weniger nützlicher Discord-Bot.\nDie folgenden Commands kannst du nutzen, um mit mir zu reden oder mir Anweisungen zu geben.\n\n-----------------------------\n",
                    "url": "http://traders-hub.de/veggie-gang/#chicor%C3%A9e-chantal",
                    "color": 7419530,
                    "footer": {
                        "text": "Für genauere Informationen zu den Commands besuche unsere Website."
                    },
                    "fields": [
                        {"name": "**Nützliche Commands**", "value": "-----------------------------"},
                        {"name": "*!au*", "value": "Mutet alle Leute in deinem Voice-Channel."},
                        {"name": "*!drinks*", "value": "Gibt eine Liste aller Drinks aus, die an diesem Tag/Abend getrunken wurden."},
                        {"name": "*!prost*", "value": "Fügt einen Drink deiner Liste an Drinks hinzu. "},
                        {"name": "*!random*", "value": "Erstellt einen Randomizer und zieht Sieger, nachdem alle per Reaktion teilgenommen haben."},
                        {"name": "*!saufen*", "value": "Startet/Beendet den Sauftimer: Immer nach Ablauf des Intervals, wird jemand der sich in einem Voice-Channel befindet auserwählt zum Saufen."},
                        {"name": "*!teams*", "value": "Erstellt zufällig 2 Teams aus allen, die per Reaktion Teilnehmen."},
                        {"name": "*!topdrinks*", "value": "Gibt eine Topliste der Trinker aus."},
                        {"name": "*!website*", "value": "Postet einen Link zu unserer Website."},
                        {"name": "*!ww*", "value": "Erstellt eine Partie Werwolf und teilt jedem Spieler eine Rolle zu. Erzähler wird derjenige, der den Command geschrieben hat. (Teilnahme per Reaktion, min 8 Leute)\n\n-----------------------------"},
                        {"name": "**Eher Unnütze Commands**", "value": "-----------------------------\n\n*!chuck*\n*!ehre*\n*!luther*\n*!mimimi*\n*!opa*\n*!standard*\n*!trump*\n*!würg*"}
                    ]
                }

                message.channel.send({embed: data});
                break;
            
            case 'luther':
                message.channel.send('Luther! Luther! Wer ist Luther?!? MARTIN LUTHER!!!\nhttps://www.youtube.com/watch?v=AOEQrKk6AZ4');
                break;

            case 'mimimi':
                message.reply('biste n ADC oder was?!?');
                break;

            case 'opa':
                let jesseMember = message.member.guild.members.cache.get(jesseID);
                let jesseName = jesseMember.user.username;

                if (jesseMember.nickname !== null){
                    jesseName = jesseMember.nickname;
                }

                let prompTextGrandpa = `**${jesseName}'s Opa** hat immer gesagt: \n`;

                api.getOpa().then(sentence => {
                    prompTextGrandpa = prompTextGrandpa + sentence;
                    message.channel.send(prompTextGrandpa);
                }).catch(err => console.log(err));
                break;

            case 'poll':
                let entries = message.content.split(PREFIX + args[0])[1].split(",");

                if (entries.length <= 1 || entries.length >= 10){
                    message.reply("so funktioniert das nicht!\nDu musst 2-9 verschiedene Möglichkeiten, durch ein Komma getrennt, angeben!");
                    return;
                }

                let thisPoll = [];
                let prompTextPoll = `Hier is n Poll!`;
                let thisPollLength = 0;
                for (let entry in entries){
                    thisPoll[entries[entry]] = 0;
                    thisPollLength++;
                }

                let emojiList = [`1️⃣`, `2️⃣`,`3️⃣`, `4️⃣`,`5️⃣`, `6️⃣`,`7️⃣`, `8️⃣`,`9️⃣`];

                message.channel.send(prompTextPoll).then(botMsg => {
                    polls[botMsg.id] = new Poll.Poll(botMsg, thisPoll, thisPollLength);
                    for (let i = 0; i < thisPollLength; i++){
                        botMsg.react(emojiList[i]);
                    }
                });

                //TODO(Inform owner about poll id)
                break;

            case 'prost':
                if (message.member.voice.channel === null || message.member.voice.channel === undefined){
                    message.reply("join erstmal nem Voice-Channel, ALLA!");
                    return;
                }

                let text = "";
                for (let i = 1; i<args.length; i++){
                    text = text + args[i] + " ";
                }

                if (text === ""){
                    message.reply("du musst erst ein Getränk hinzufügen.");
                    return;
                }

                let user = message.member.user.id;
                if (!prostListe[user]){
                    prostListe[user] = [];
                }

                prostListe[user].push(text);
                prostListe[user].sort();
                console.log(prostListe);

                message.channel.send(feedbackSentences[Math.floor(Math.random() * (feedbackSentences.length))]);

                break;

            case 'random':
                if (!args[1]){
                    message.reply("bitte füge zumindest eine Zahl hinzu.");
                }else{
                    let randomizerSlots = parseInt(args[1]);
                    randomizerSlots = Math.max(1, randomizerSlots);
                    
                    let returnCount = 1;
                    if (args[2] != null){
                        returnCount = Math.min(randomizerSlots, parseInt(args[2]));
                    }

                    let prompTextRandomizer = `Es wurde ein neuer Randomizer mit ${randomizerSlots} Slots erstellt. Reagiere auf diese Nachricht, um hinzugefügt zu werden.`;
                    message.reply(prompTextRandomizer).then(botMsg => {
                        randomizer[botMsg.id] = new Randomizer.Randomizer(botMsg, randomizerSlots, randomizer.length+1, returnCount);
                    });
                }
                break;

            case 'roles':
                let role = message.guild.roles.cache.filter(role => role.id == lowestRole);
                onlineMembers = message.guild.members.cache.filter(member => !member.user.bot && member.roles.hoist == undefined );
                //console.log(role);
                onlineMembers.each(member => console.log(member.user.username));
                onlineMembers.each(member => member.roles.add(role));
                break;

            case 'saufen':
                const saufChannel = message.guild.channels.cache.filter(channel => channel.id == saufChannelId);
                
                gesoffen = [];

                if (!args[1] && args[1] != "start" && args[1] != "stop"){
                    message.reply("bitte schreibe \"start\" oder \"stop\" um den Sauftimer zu starten bzw. zu stopen.");
                }else if (args[1] == "start"){
                    let interval = 1;

                    if (args[2] != null){
                        interval = Math.max(interval, parseInt(args[2]));
                    }
                    
                    let prompTextSaufen = `ich hab für euch einen Sauftimer erstellt!!!\nAlle ${interval} Minuten muss jemand trinken!!!`;
                    message.reply(prompTextSaufen).then(
                        sauftimer = setInterval(function() {
                            let onlineArray = [];
                            let onlinePlayers = message.guild.members.cache.filter(member => member.presence.status == "online" && member.voice.channel != null);
                            onlinePlayers.forEach(member => onlineArray.push(member));

                            onlineArray = ArrayFunctions.shuffle([...onlineArray])
                            
                            let found = false;
                            let lengthBefore = gesoffen.length;
                            onlineArray.forEach(member => {
                                if (!found && !ArrayFunctions.ArraySearch(gesoffen, member.id)){
                                    gesoffen.push(member.id);
                                    member.send(`\nHey!\nAlles Klar bei dir?\nMir egal!\n**Sauf jetzt!**`);
                                    saufChannel.forEach(channel => channel.send(`@everyone <@${member.id}> muss trinken!!!`));
                                    console.log(gesoffen);
                                    found = true;
                                }
                            });

                            if (!found){
                                saufChannel.forEach(channel => channel.send(`@everyone Jeder der aktuell online ist hat bereits gesoffen!!!`));
                                clearInterval(sauftimer);
                            }

                        }, interval*60000));
                }else {
                    if (sauftimer != undefined){
                        clearInterval(sauftimer);
                    }
                    message.reply("ich habe den derzeitigen Sauftimer gestoppt.")
                }

                break;

            case 'save':
                api.saveDrinks(prostListe, bot.guilds.cache.get(variables.guild).members.cache).then(prostListe = []);
                break;

            case 'standard':
                message.channel.send('Freaks kommen raus nach Mitternacht, Standard\nDrei Sorten Kush im Rizla, Standard\nLinks Jasmin, rechts Sabrina, Standard \nFrauen süß wie Baklava, Standard\n', {tts: true}).then(
                    message.channel.send('Shoutout David Alaba, Standard \nNur Originale, kein Duplikat, Standard \n44, 36, Altona, Standard', {tts: true})
                );
                break;
            
            case 'teams':
                if (!parseInt(args[1])){
                    if (message.member.voice.channel === null){
                        message.reply("entweder joinen du und deine Mates nem Voice-Channel oder du gibst ne Zahl an wie viele Spieler mitmachen!");
                        return;
                    }

                    let membersToAdd = message.member.voice.channel.members;
                    let memberIDs = [];
                    membersToAdd.forEach(member => {
                        memberIDs.push(member.id);
                    });

                    let prompTextTeams = `Es wurde ein Matchmaking-Pool mit ${memberIDs.length} Slots eröffnet.`;
                    message.reply(prompTextTeams).then(botMsg => {
                        let pool = new Pool.Pool(botMsg, memberIDs.length, pools.length+1);
                        for (let i in memberIDs){
                            pool.addPlayerSilently(memberIDs[i]);
                        }
                    });
                }else{
                    let playerSlotsTeams= 0;
                    playerSlotsTeams = parseInt(args[1]);
                    playerSlotsTeams = Math.max(2, playerSlotsTeams);
                    let prompTextTeams = `Es wurde ein Matchmaking-Pool mit ${playerSlotsTeams} Slots eröffnet. Reagiere auf diese Nachricht, um hinzugefügt zu werden.`;
                    message.reply(prompTextTeams).then(botMsg => {
                        pools[botMsg.id] = new Pool.Pool(botMsg, playerSlotsTeams, pools.length+1);
                    });
                }
                break;

            case 'topdrinks':
                let yesterday = new Date();
                // new Date().toISOString().split("T")[0] + "T23:59:59")
                yesterday.setDate(yesterday.getDate() - 1);

                yesterday = new Date(yesterday.toISOString().split("T")[0] + "T23:59:59");

                let drinksLadder = {
                    "title": "Topliste",
                    "description": "Hier ist die aktuelle Topliste der Trinker!\n\n-----------------------------\n",
                    "url": "http://traders-hub.de/drinks",
                    "color": 7419530,
                    "footer": {
                        "text": `Für genauere Informationen zu den Drinks besuche unsere Website!\nStand: ${yesterday.toString().split("G")[0]} Uhr`
                    },
                    "fields": []
                };

                fetch('http://chicoree-chantal.traders-hub.de/drinks/ladder')
                    .then(response => response.json())
                    .then(drinksData =>{
                        let drinkFields = [];
                        let pos = 1;
                        for (i in drinksData){
                            drinkFields[i] = {};
                            drinkFields[i].name = `${pos++}. ${drinksData[i].name}`;
                            drinkFields[i].value = `${drinksData[i].total} Drink(s)`;
                        }
                        drinksLadder.fields = drinkFields;
                        message.channel.send({embed: drinksLadder});
                    });
                break;

            case 'trump':
                fetch('http://tronalddump.io/random/meme')
                    .then(res => message.channel.send({files: [{
                            attachment: res.body
                        }]}));
                break;

            case 'updatenicks':
                api.updateNicknames(message.guild.members.cache);
                break;

            case 'website':
                message.reply('http://traders-hub.de/ ist die beste Website, wo gibt!!!');
                break;

            case 'würg':
                message.channel.send('*würg* *würg* GIERIG GIERIG');
                break;       
            
            case 'ww':
                let playerSlotsWW = 0;
                if (args[1] != null){
                    playerSlotsWW = parseInt(args[1]);
                }
                playerSlotsWW = Math.max(8, playerSlotsWW);
                playerSlotsWW = Math.min(18, playerSlotsWW);
                let messageAuthor = message.author
                let prompTextWW = `Es wurde eine Runde **Werwolf** mit **${playerSlotsWW}** Spielern erstellt. Ihr **Erzähler** ist <@${messageAuthor.id}>.\nJeder Spieler kann per Reaktion auf diese Nachricht beitreten.`;
                message.channel.send(prompTextWW).then(botMsg => {
                    wwGames[botMsg.id] = new WWGame.WW(botMsg, playerSlotsWW, wwGames.length+1, messageAuthor);
                });
                break;

            default:
                if (message.channel.id !== variables.testChannelId){
                    message.reply("das ist leider kein valider Command.\nUm zu sehen welche Commands du benutzen kannst, schreibe **!help**");
                }
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
    let pool = pools[reaction.message.id];
    if (pool){
        pool.addPlayer(user.id);
    }

    let ww = wwGames[reaction.message.id];
    if (ww){
        ww.addPlayer(user.id);
    }

    let rand = randomizer[reaction.message.id];
    if (rand){
        rand.addPlayer(user.id);
    }

    let poll = polls[reaction.message.id];
    if (poll){
        if (reaction.me) return;
        let voteNumber = parseInt(reaction.emoji.name.split('⃣')[0]);
        if (voteNumber >= 1 && voteNumber <= poll.getEntryCount()){
            poll.addPlayer(user.id, voteNumber);
        }
    }
});

bot.login(token);