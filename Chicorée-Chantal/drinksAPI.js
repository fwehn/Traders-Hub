const express = require('express');
const mongoose = require('mongoose');
const fs = require('file-system');

const rawdata = fs.readFileSync('./variables.json');
const variables = JSON.parse(rawdata);

const app = express();
const port = 2712;

const personSchema = new mongoose.Schema({
    name: String,
    total: Number,
    daily: Number,
    drinks: [String]
});

const drinksSchema = new mongoose.Schema({
    date: Date,
    persons: [personSchema],
    dailyBest: personSchema,
    totalBest: personSchema
});

const drinksModel = mongoose.model("Drinks", drinksSchema);

function startUp(){
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://" + variables.mongo.user + ":" + encodeURIComponent(variables.mongo.password) + "@" + variables.mongo.hostString, {useNewUrlParser: true, useUnifiedTopology:true})
        .then(console.log("I guess we're connected?"))
        .catch(err => console.log(err));
    // console.log("mongodb://" + variables.mongo.user + ":" + encodeURIComponent(variables.mongo.password) + "@" + variables.mongo.hostString)
    app.get("/", (req, res) => {
        drinksModel.find({}, function (err, persons) {
            if (err) return handleError(err);
            res.send(JSON.stringify(persons));
            console.log(persons);
        });
    });

    app.listen(port, () => {
        console.log("Server listening on port " + port);
    });
}

async function saveDrinks(prostListe) {
    if (prostListe !== null){
        let lastDay = {}
        await drinksModel.findOne({}, {}, {sort: {'date': -1}}, function (err, day) {
            console.log(day);
            lastDay = day;
        });

        let bestCounterDaily = 0;
        let bestPersonDaily = {};

        let bestCounterTotal = 0;
        let bestPersonTotal = {};

        let personsOfList = []
        for (let i in prostListe) {
            console.log("Saved:" + prostListe[i] + " from " + i);
            let drinksRaw = prostListe[i];
            let last = drinksRaw[0];
            let index = 1;
            let drinksFormatted = [];
            let lastTotal = 0;
            let currentTotal = 0;

            for (let j = 0; j < drinksRaw.length; j++) {
                if (drinksRaw[j + 1] !== last || j === drinksRaw.length - 1) {
                    drinksFormatted.push(index + " " + drinksRaw[j]);
                    index = 1;
                    last = drinksRaw[j + 1];
                } else {
                    index++;
                }
            }

            if (lastDay != null){
                for (person in lastDay.persons) {
                    if (lastDay.persons[person].name === i) {
                        lastTotal = lastDay.persons[person].total;
                        console.log(lastTotal);
                    }
                }
            }


            let dailyToSave = prostListe[i].length;
            currentTotal = lastTotal + dailyToSave;

            let personToSave = {name: i, daily: dailyToSave, drinks: drinksFormatted, total: currentTotal};
            console.log(personToSave);

            if (currentTotal > bestCounterTotal){
                bestCounterTotal = currentTotal;
                bestPersonTotal = personToSave;
            }

            if (dailyToSave > bestCounterDaily){
                bestCounterDaily = dailyToSave;
                bestPersonDaily = personToSave;
            }

            personsOfList.push(personToSave);
        }

        let myData = new drinksModel({date: new Date(), persons: personsOfList, dailyBest: bestPersonDaily, totalBest: bestPersonTotal});
        myData.save()
            .then(item => {
                console.log("item saved to database");
            })
            .catch(err => {
                console.log("unable to save to database");
            });
    }
}

function saveDrinksTest(){
    let dateTest = new Date()
    console.log(dateTest);

    let testPerson = {name: "InFINNity", total: 5, daily: 5, drinks: ["3 peddas", "2 kleine don papa"]}

    let myData = new drinksModel({date: dateTest, persons: [testPerson], dailyBest: testPerson, totalBest: testPerson});
    myData.save()
        .then(item => {
            console.log("item saved to database");
        })
        .catch(err => {
            console.log("unable to save to database");
        });
}

function loadAllDrinks(){
    drinksModel.find({}, function (err, persons) {
        if (err) return handleError(err);
        console.log(persons);
        // console.log(persons[0].persons);

    });
}

module.exports = {
    startUp, saveDrinksTest, loadAllDrinks, saveDrinks
}