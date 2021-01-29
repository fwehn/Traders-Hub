const express = require('express');
const mongoose = require('mongoose');
const fs = require('file-system');
const cors = require('cors');

const rawData = fs.readFileSync('./variables.json');
const variables = JSON.parse(rawData);

const app = express();
const port = process.env.PORT;
// const port = 2712;

app.use(cors())

const personSchema = new mongoose.Schema({
    name: String,
    total: Number
});

const personModel = mongoose.model("Person", personSchema);

const personDrinkSchema = new mongoose.Schema({
    person: {type: mongoose.Schema.Types.ObjectId, ref: 'Person'},
    daily: Number,
    drinks: [String]
});

const drinksSchema = new mongoose.Schema({
    date: Date,
    persons: [personDrinkSchema],
    dailyBest: {type: mongoose.Schema.Types.ObjectId, ref: 'Person'},
    dailyBestCounter: Number
});

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
            .populate({ path: 'dailyBest', select: 'name -_id'})
            .then(dates => {
            console.log(dates);
            let resData = [];
            for (let date in dates){
                let dateDTO = {
                    date: dates[date].date,
                    dailyBest: dates[date].dailyBest.name,
                    dailyBestCounter: dates[date].dailyBestCounter
                }
                resData.push(dateDTO)
            }
            resData.sort();
            resData.reverse();
            res.type('json');
            res.send(resData);
            console.log(resData);
        });
    });

    app.get("/drinks/d/:date", (req, res) => {
        drinksModel.findOne({date: new Date(req.params.date)}, 'date persons dailyBest dailyBestCounter -_id')
            .populate({ path: 'persons.person', select: 'name total -_id'})
            .populate({ path: 'dailyBest', select: 'name total -_id'})
            .then(data => {
                console.log(data.persons[0].person);
                res.type('json');
                res.send(data);
        })
    });

    app.listen(port, () => {
        console.log("Server listening on port " + port);
    });
}

async function saveDrinks(prostListe) {

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
            let currentPerson = {};
            let personDrinkToSave = {};

            await personModel.findOne({name: i}, function (err, person) {
                if (err){console.log(err)}

                if (person !== null){
                    person.total += prostListe[i].length;
                    person.save().then(savedPerson =>{
                        currentPerson = savedPerson;
                    });
                }else{
                    let personData = new personModel({name: i, total: prostListe[i].length});
                    personData.save().then(savedPerson =>{

                        currentPerson = savedPerson;
                    });
                }
            });
            console.log(currentPerson);

            await personModel.findOne({name: i}, function (err, person) {
                if (err){console.log(err)}
                currentPerson = person;
            });

            if (prostListe[i].length > bestCounterDaily){
                bestCounterDaily = prostListe[i].length;
                bestPersonDaily = currentPerson;
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

            personDrinkToSave = {person: currentPerson, daily: prostListe[i].length, drinks: drinksFormatted};
            personsOfList.push(personDrinkToSave);
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


function loadAllDrinks(){
    personModel.findOne({name: "InFINNity"}, function (err, person) {
        console.log(person);
    });
}

module.exports = {
    startUp, loadAllDrinks, saveDrinks
}