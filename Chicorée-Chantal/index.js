//Importing Section
require('dotenv').config();
const discord = require("discord.js");
const commands = require("./commandList.js");

console.log("Imported!");


//Initializing Section
console.log("Starting...\n");
const client = new discord.Client();
const updateCommands = process.env.UPDATE_COMMANDS;

client.on('guildMemberAdd', member => {
    let role = member.guild.roles.cache.filter(role => role.id === process.env.LOWESTROLEID);
    member.roles.add(role).catch(err => console.log(err));
})

client.on("ready", async () => {
    //Delete all old Commands
    let oldCommands = await client.api.applications(client.user.id).guilds(process.env.GUILDID).commands.get();
    for (let i in oldCommands) {
        if (updateCommands.includes(oldCommands[i].name)) {
            await client.api.applications(client.user.id).guilds(process.env.GUILDID).commands(oldCommands[i].id).delete().catch(err => console.log(err));
            console.log(`Deleted: ${oldCommands[i].name}`);
        }
    }
    //Add all new Commands
    for (let i in commands){
        if (updateCommands.includes(i)){
            await createGuildCommand(commands[i].commandData, process.env.GUILDID).catch(err => console.log(err));
            console.log(`Registered: ${i}`);
        }
    }
    console.log("")
    console.log("Ready!");
});


client.ws.on("INTERACTION_CREATE", async (interaction) => {
    // console.log(interaction.data.name);

    if (!commands[interaction.data.name]){
        await sendPrivateResponse(interaction, "Sorry, aber mein Schöpfer war dumm!");
        return;
    }

    await handleCommand(interaction);

});

client.login(process.env.TOKEN).catch((err)=>console.log(err));






//Functions
async function createGuildCommand(commandData, guildID){
    return await client.api.applications(client.user.id).guilds(guildID).commands.post({data: commandData});
}

async function handleCommand(interaction){
    commands[interaction.data.name]
        .commandCallback(interaction)
        .then((callbackData) => {
            // console.log(callbackData);
            switch (callbackData.type){
                case "public":
                    sendWaiting(interaction);
                    sendPublicResponse(interaction, callbackData.content);
                    break;

                case "private":
                    sendPrivateResponse(interaction, callbackData.content);
                    break;

                case "channel":
                    sendMessageToBotChannel(callbackData.content.announcement);
                    sendPrivateResponse(interaction, callbackData.content.response);
                    break;

                case "poll":
                    sendWaiting(interaction);
                    sendPublicResponse(interaction, callbackData.content)
                        .then(msg => {
                            getMessage(msg.channel_id, msg.id).then(msg => {
                                let emojiList = [`1️⃣`, `2️⃣`,`3️⃣`, `4️⃣`,`5️⃣`, `6️⃣`,`7️⃣`, `8️⃣`,`9️⃣`];
                                // let emojiList = [`<:Stonks3:774964846785069096>`, `2️⃣`,`3️⃣`, `4️⃣`,`5️⃣`, `6️⃣`,`7️⃣`, `8️⃣`,`9️⃣`];
                                for (let i = 0; i < callbackData.options; i++){
                                    msg.react(emojiList[i]);
                                }
                            }).catch(console.error);
                        });

                    break;

                default:
                    sendPrivateResponse(interaction, callbackData.content);
                }
        }).catch(err => {
            console.log(err)
            sendPrivateResponse(interaction, "Mit diesem Command gibt es derzeit Probleme!\nWende dich bitte an unsere Technik!")
        });
}

async function sendWaiting(interaction){
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data:{
            type:5
        }
    });
}

async function sendPrivateResponse(interaction, content){
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data:{
            type:4,
            data: {
                content: content,
                flags: 64
            }
        }
    }).catch(err => console.log(err));
}

async function sendPublicResponse(interaction, content){
    return await new discord.WebhookClient(client.user.id, interaction.token).send(content).catch(err => console.log(err));
}

async function sendMessageToBotChannel(content){
    client.channels.cache.get(process.env.BOT_CHANNEL).send(content).catch(err => console.log(err));
}

async function sendPrivateMessageToUser(userId, message){
    client.users.fetch(userId, false).then((user) => {
        user.send(message);
    });
}

async function getChannel(channelId){
    return client.guilds.cache.get(process.env.GUILDID).channels.cache.get(channelId);
}

async function getMessage(channelId, messageId){
    return new Promise((resolve, reject) => {
        getChannel(channelId).then(channel => {channel.messages.fetch(messageId).then(msg => {resolve(msg)}).catch(err => reject(err))});
    });
}

module.exports = {
    getChannel, sendPrivateMessageToUser
}
