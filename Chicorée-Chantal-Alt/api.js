const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('file-system');
const arrayFunctions = require('./array-functions');

const rawData = fs.readFileSync('./variables.json');
const variables = JSON.parse(rawData);


const app = express();
const port = process.env.PORT || 2712;
// const port = 2712;

app.use(cors());

const opaSchema = new mongoose.Schema({
    sentence: String
}, {versionKey: false});

const opaModel = mongoose.model("Opa", opaSchema);

const personSchema = new mongoose.Schema({
    discordId: String,
    name: String,
    total: Number,
    nickname: String
}, {versionKey: false});

const personModel = mongoose.model("Person", personSchema);

const personDrinkSchema = new mongoose.Schema({
    person: {type: mongoose.Schema.Types.ObjectId, ref: 'Person'},
    daily: Number,
    drinks: [String]
}, {versionKey: false});

const drinksSchema = new mongoose.Schema({
    date: Date,
    persons: [personDrinkSchema],
    dailyBest: {type: mongoose.Schema.Types.ObjectId, ref: 'Person'},
    dailyBestCounter: Number
}, {versionKey: false});

const drinksModel = mongoose.model("Drinks", drinksSchema);

function startUp(){
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://" + variables.mongo.user + ":" + encodeURIComponent(variables.mongo.password) + "@" + variables.mongo.hostString, {useNewUrlParser: true, useUnifiedTopology:true})
        .then(console.log("I guess we're connected?"))
        .catch(err => console.log(err));
    // console.log("mongodb://" + variables.mongo.user + ":" + encodeURIComponent(variables.mongo.password) + "@" + variables.mongo.hostString)
    app.get("/",(req, res) => {
        res.send("Hi I'm Chicorée-Chantal!");
    });

    app.get("/drinks", (req, res) => {
        drinksModel.find({}, 'date dailyBest dailyBestCounter -_id')
            .populate({ path: 'dailyBest', select: 'name nickname -_id'})
            .then(dates => {
            // console.log(dates);
            let resData = [];
            for (let date in dates){
                let dateDTO = {
                    date: dates[date].date,
                    dailyBest: dates[date].dailyBest.name,
                    dailyBestNickname: dates[date].dailyBest.nickname,
                    dailyBestCounter: dates[date].dailyBestCounter
                }
                resData.push(dateDTO)
            }
            resData.sort(arrayFunctions.compareArrayOfObjectsByFieldDate);
            resData.reverse();
            res.type('json');
            res.send(resData);
            // console.log(resData);
        });
    });

    app.get("/drinks/d/:date", (req, res) => {
        drinksModel.findOne({date: new Date(req.params.date)}, 'date persons dailyBest dailyBestCounter -_id')
            .populate({ path: 'persons.person', select: 'name nickname total -_id'})
            .populate({ path: 'dailyBest', select: 'name nickname total -_id'})
            .then(data => {
                data.persons.sort(arrayFunctions.compareArrayOfObjectsByFieldDaily);
                data.persons.reverse();
                // console.log(data.persons[0].person);
                res.type('json');
                res.send(data);
        })
    });

    app.get("/drinks/ladder", (req, res) => {
       personModel.find({}, 'name nickname total -_id')
           .then(data => {
           // console.log(data);
           let resData = [];
           for (let i in data){
                resData[i] = data[i];
           }
           resData.sort(arrayFunctions.compareArrayOfObjectsByFieldTotal);
           resData.reverse();
           res.type('json');
           res.send(resData.slice(0, 10));
       }).catch(err => console.log(err));
    });

    app.post("/opa", (req, res) =>{
        console.log(req.query);
        res.type('text');
        if (req.query.sentence !== undefined){
            let newSentence = new opaModel({sentence: req.query.sentence});
            newSentence.save()
                .then(() => {
                    console.log("item saved to database");
                    res.send("Saved: " + req.query.sentence);
                })
                .catch(err => {
                    console.log("unable to save to database");
                    console.log(err);
                    res.send("Unable to save: " + req.query.sentence);
                });
        }else{
            res.send("U have to set a \"sentence\" query.");
        }
    });

    app.listen(port, () => {
        console.log("Server listening on port " + port);
    });
}

async function updateNicknames(members){
    personModel.find({})
        .then(data => {
            // console.log(data);
            for (let person in data){
                // console.log(person)
                let discordPerson = members.get(data[person].discordId);
                if (discordPerson === undefined || discordPerson === null){
                    continue;
                }

                let discordNickname = discordPerson.nickname;
                if (discordNickname == null){
                    // console.log("nix");
                    data[person].nickname = "";
                    data[person].save();
                }else{
                    // console.log(discordNickname);
                    data[person].nickname = discordNickname;
                    data[person].save();
                }
            }
        }).catch(err => console.log(err));
}

async function saveDrinks(prostListe, members) {

    let counter = 0;
    for (let i in prostListe){
        counter++;
    }
    console.log(counter);
    if (counter > 0){
        console.log("verstanden")
        let bestCounterDaily = 0;
        let bestPersonDaily = {};

        let personsOfList = []
        for (let i in prostListe) {
            console.log("Saved:" + prostListe[i] + " from " + i);
            let drinksRaw = prostListe[i];
            let last = drinksRaw[0];
            let index = 1;
            let drinksFormatted = [];
            let personDrinkToSave = {};

            let discordPerson = members.get(i);

            if (discordPerson === undefined || discordPerson === null){
                continue;
            }

            let discordNickname = discordPerson.nickname;
            if (discordNickname === undefined || discordNickname === null){
                discordNickname = "";
            }

            await personModel.findOne({discordId: i}, function (err, person) {
                if (err){console.log(err)}

                if (person !== null){
                    person.total += prostListe[i].length;
                    person.name = discordPerson.user.username;
                    person.nickname = discordNickname;
                    person.save();
                }else{
                    let personData = new personModel({discordId: i, name: discordPerson.user.username, total: prostListe[i].length, nickname: discordNickname});
                    personData.save();
                }
            });

            await personModel.findOne({discordId: i}, function (err, person) {
                if (err){
                    console.log(err)
                }

                if (prostListe[i].length > bestCounterDaily){
                    bestCounterDaily = prostListe[i].length;
                    bestPersonDaily = person;
                }

                for (let j = 0; j < drinksRaw.length; j++) {
                    if (drinksRaw[j + 1] !== last || j === drinksRaw.length - 1) {
                        drinksFormatted.push(index + " " + drinksRaw[j]);
                        index = 1;
                        last = drinksRaw[j + 1];
                    } else {
                        index++;
                    }
                }

                personDrinkToSave = {person: person, daily: prostListe[i].length, drinks: drinksFormatted};
                personsOfList.push(personDrinkToSave);
            });


        }
        let dateToSave = new Date().toISOString().split("T")[0] + "T23:59:59";
        let myData = new drinksModel({date: new Date(dateToSave), persons: personsOfList, dailyBest: bestPersonDaily, dailyBestCounter: bestCounterDaily});
        myData.save()
            .then(() => {
                console.log("item saved to database");
            })
            .catch(err => {
                console.log("unable to save to database");
                console.log(err);
            });
    }
}

async function getOpa(){
    return new Promise((resolve, reject) => {
        opaModel.countDocuments().exec(function (err, count) {
            let random = Math.floor(Math.random() * count)
            opaModel.findOne()
                .skip(random)
                .then(result => {
                    resolve(result.sentence)
                }).catch(err => {
                reject(err);
            });
        });
    });
}

module.exports = {
    startUp, saveDrinks, getOpa, updateNicknames
}