require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const arrayFunctions = require('./../Chicorée-Chantal-Alt/array-functions.js');

const app = express();
const port = process.env.PORT
const config = JSON.parse(process.env.APP_CONFIG);

const {opaModel, personModel, drinksModel} = require('./api-models.js');

app.use(cors());

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://" + config.mongo.user + ":" + encodeURIComponent(config.mongo.password) + "@" + config.mongo.hostString, {useNewUrlParser: true, useUnifiedTopology:true})
    .then(() => console.log("I guess we're connected?"))
    .catch(err => console.log(err));

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
        });
});

//TODO GET /drinks/today || req: {} || res: {drinks: [{id: STRING, drinks: STRING}, ...], total: NUMBER, leader: [name: STRING, ...]}
app.get("/drinks/today", (req, res) => {
    //TODO send correct data
    res.type('json');
    res.send({
        drinks: [
            {name: "1", drinks: "3 Peddas"},
            {name: "Finn", drinks: "3 Nicht-Wein"},
            {name: "InFINNity", drinks: "3 Schnaps"}
        ],
        total: 9,
        leader: ["1", "Finn", "InFINNity"],
        bestCount: 3
    });
});

app.get("/drinks/d/:date", (req, res) => {
    drinksModel.findOne({date: new Date(req.params.date)}, 'date persons dailyBest dailyBestCounter -_id')
        .populate({ path: 'persons.person', select: 'name nickname total -_id'})
        .populate({ path: 'dailyBest', select: 'name nickname total -_id'})
        .then(data => {
            data.persons.sort(arrayFunctions.compareArrayOfObjectsByFieldDaily);
            data.persons.reverse();
            res.type('json');
            res.send(data);
        })
});

app.get("/drinks/ladder", (req, res) => {
    personModel.find({}, 'name nickname total -_id')
        .then(data => {
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

//TODO POST /drinks/p/:id || req: {nickname: STRING, drink: STRING, content: NUMBER, amount: DOUBLE}
//creates a JS-Object and posts it via cronjob on database

app.get("/opa", (req, res) => {
    getOpa().then(sentence => {
        res.type('json');
        res.send({sentence: `**Jesse's Opa** hat immer gesagt:\n${sentence}`})
    }).catch(err => console.log(err));
})

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
    console.log(`http://localhost:${port}`);
    console.log(`http://localhost:${port}/drinks`);
    console.log(`http://localhost:${port}/drinks/ladder`);
    console.log(`http://localhost:${port}/opa`);
});










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