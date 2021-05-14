const fetch = require('node-fetch');

const commandData = {
    name: "trump",
    description: "Ein Zitat unserer liebsten Witzfigur!",
};

function commandCallback(interaction){
    return new Promise((resolve, reject) => {
        fetch('https://tronalddump.io/random/meme')
            .then( (res) => {
                resolve({
                    type: "public",
                    content: {
                        files: [
                            {
                                attachment: res.body
                            }
                        ]
                    }
                })
            }).catch(err => {
                reject(err);
            });
    });
}

module.exports = {
    commandData, commandCallback
}
