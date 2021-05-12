const commandsPath = "commands";
const normalizedPath = require("path").join(__dirname, commandsPath);
let stuffToExport = {};

require("fs").readdirSync(normalizedPath).forEach(function(file) {
    let thisFile = require(`./${commandsPath}/${file}`);
    stuffToExport[thisFile.commandData.name] = thisFile;
});

module.exports = stuffToExport;