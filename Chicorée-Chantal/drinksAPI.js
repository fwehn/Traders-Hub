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
    app.get("/",(req, res) => {

        res.send("Hi I'm Chicorée-Chantal!");
    });

    app.get("/drinks", (req, res) => {
        drinksModel.find({}, function (err, dates) {
            if (err) {
                console.log(err)
                return;
            }
            let datesToSend = [];
            for (let date in dates){
                datesToSend.push(dates[date].date);
            }
            res.type('json');
            res.send(datesToSend);
            console.log(datesToSend);
        });
    });

    app.get("/drinks/d/:date", (req, res) => {
        drinksModel.findOne({date: new Date(req.params.date)}, function (err, data){
           if (err || data == null) {
               res.send("There is no data for " + new Date(req.params.date));
               return;
           }
           res.type('json');
           res.send(data);
        });
    });

    app.listen(port, () => {
        console.log("Server listening on port " + port);
    });
}

async function saveDrinks(prostListe) {
    if (prostListe !== []){
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
                for (let person in lastDay.persons) {
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
            .then(() => {
                console.log("item saved to database");
            })
            .catch(() => {
                console.log("unable to save to database");
            });
    }
}


function loadAllDrinks(){
    drinksModel.find({}, function (err, persons) {
        if (err) return handleError(err);
        console.log(persons);
        // console.log(persons[0].persons);

    });
}

module.exports = {
    startUp, loadAllDrinks, saveDrinks
}