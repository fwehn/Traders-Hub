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
    await sendWaiting(interaction)
    let responseClient = await new discord.WebhookClient(client.user.id, interaction.token);

    if (!commands[interaction.data.name]){
        return;
    }
    await responseClient.send(commands[interaction.data.name].commandCallback(interaction));
});

client.login(process.env.TOKEN).catch((err)=>console.log(err));






//Functions
async function createGuildCommand(commandData, guildID){
    return await client.api.applications(client.user.id).guilds(guildID).commands.post({data: commandData});
}

async function sendWaiting(interaction){
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data:{
            type:5
        }
    });
}