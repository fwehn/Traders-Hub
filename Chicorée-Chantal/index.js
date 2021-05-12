//Importing Section
require('dotenv').config();
const discord = require("discord.js");
const commands = require("./commandList.js");

console.log("Imported!");


//Initializing Section
console.log("Starting...")
const client = new discord.Client()


client.on("ready", async () => {
    //Delete all old Commands
    let oldCommands = await client.api.applications(client.user.id).guilds(process.env.GUILDID).commands.get();
    for (let i in oldCommands){
        await client.api.applications(client.user.id).guilds(process.env.GUILDID).commands(oldCommands[i].id).delete().catch(err => console.log(err));
    }

    //Add all new Commands
    for (let i in commands){
        await createGuildCommand(commands[i].commandData, process.env.GUILDID).catch(err => console.log(err));
    }
    console.log("Ready!");
});


client.ws.on("INTERACTION_CREATE", async (interaction) => {
    console.log(interaction.data.name);

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
    let callbackData = commands[interaction.data.name].commandCallback(interaction);

    switch (callbackData.type){
        case "public":
            await sendWaiting(interaction);
            await sendPublicResponse(interaction, callbackData.content);
            break;

        case "private":
            await sendPrivateResponse(interaction, callbackData.content);
            break;

        default:
            await sendPrivateResponse(interaction, callbackData.content);
    }
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
    });
}

async function sendPublicResponse(interaction, content){
    await new discord.WebhookClient(client.user.id, interaction.token).send(content);
}