const Discord = require('discord.js');
const bot = new Discord.Client();

const token = 'NzM3MzQzMTUxODIzNTE5ODA3.Xx7-Ug.K-_ij9LVXboI6GPcAhQmFDPI2vo';

const PREFIX = '!';

bot.on('ready', () => {
    console.log('This Bot is Online');
})

bot.on('message', message =>{
    let args = message.content.substring(PREFIX.length).split(" ");

    // if (!message.author.roles.some(role => role.name === 'Vegi-Gang'))
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

            case 'mimimi':
                message.channel.send('Das ist das Geräusch das der Stein immer macht.');
                break;

            case 'standard':
                message.channel.send('Freaks kommen raus nach Mitternacht, Standard\nDrei Sorten Kush im Rizla, Standard\nLinks Jasmin, rechts Sabrina, Standard \nFrauen süß wie Baklava, Standard \nShoutout David Alaba, Standard \nNur Originale, kein Duplikat, Standard \n44, 36, Altona, Standard');
                break;

            case 'verstanden':
                message.reply('hömmal du H***sohn, willste mir jetzt auch noch meine Arbeit wegnehmen oder was?!?!');
                break;

            case 'würg':
                message.channel.send('*würg* *würg* GIERIG GIERIG');
                break;

            case 'schande':
                message.channel.send('schande, schande, schande');
                break;

            case 'luther':
                message.channel.send('Luther! Luther! Wer ist Luther?!? MARTIN LUTHER!!!\nhttps://www.youtube.com/watch?v=AOEQrKk6AZ4');

            case 'test':
                message.channel.send('push reicht');
        }
    }
})

bot.login(token);