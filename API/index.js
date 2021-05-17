require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const arrayFunctions = require('./../Chicorée-Chantal-Alt/array-functions.js');

const app = express();
const port = process.env.PORT
const config = JSON.parse(process.env.APP_CONFIG);

const {opaModel, personModel, drinksModel, drinkSentenceModel, personModelSS2021, drinksModelSS2021} = require('./api-models.js');

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
            {name: "InFINNity", drinks: "3 Schnaps"},
            {name: "Finn", drinks: "2 Nicht-Wein"}
        ],
        total: 8,
        leader: ["1", "InFINNity"],
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

app.post("/drinks/prost", (req, res) => {
    let params = req.query;

    personModelSS2021.findOne({_id: params.id})
        .then(data => {
            params.name = params.name.split("|")[0];
            let amount = parseFloat(params.amount);
            let alcohol = amount/100*parseFloat(params.proof);
            let drink = `${params.proof}|${params.amount}|${params.name}`

            if (params.nickname === null || params.nickname === "null") params.nickname = "";

            //Create or Update person-entry
            if (data === null || data === undefined){
                data = new personModelSS2021({
                    _id: params.id,
                    username: params.username,
                    nickname: params.nickname,
                    totalCount: 1,
                    totalAmount: amount,
                    totalAlcohol: alcohol
                })
            }else{
                data.username = params.username;
                data.nickname = params.nickname;
                data.totalCount = data.totalCount + 1;
                data.totalAmount = data.totalAmount + amount;
                data.totalAlcohol = data.totalAlcohol + alcohol;
            }

            data.save().then(() => {
                let today = new Date().setHours(0,0,0,0)
                //Create or Update drinks-entry
                drinksModelSS2021.findOne({date: today})
                    .then(data => {
                        if (data === null || data === undefined){
                            let personDrink = {
                                person: params.id,
                                drinks: [drink],
                                alcoholAmount: alcohol
                            }

                            data = new drinksModelSS2021({
                                date: today,
                                data: [personDrink]
                            })
                        }else{
                            let foundPerson = data.data.findIndex(element => element.person === params.id);
                            if (foundPerson === -1){
                                let personDrink = {
                                    person: params.id,
                                    drinks: [drink],
                                    alcoholAmount: alcohol
                                }

                                data.data.push(personDrink);
                            }else{
                                let foundDrink = data.data[foundPerson].drinks.findIndex(element => element.split("|")[0] === params.proof && element.split("|")[2] === params.name)

                                if (foundDrink === -1){
                                    data.data[foundPerson].drinks.push(drink);
                                }else{
                                    let newDrinks = data.data[foundPerson].drinks
                                    let currentAmount = parseFloat(newDrinks[foundDrink].split("|")[1]) + amount;
                                    newDrinks[foundDrink] = `${params.proof}|${currentAmount}|${params.name}`;
                                    data.data[foundPerson].drinks = [];
                                    data.data[foundPerson].drinks = newDrinks;
                                }

                                data.data[foundPerson].alcoholAmount = data.data[foundPerson].alcoholAmount + alcohol;
                            }
                        }

                        data.save()
                            .then(() => {
                                res.type('json');
                                getSentence("prost")
                                    .then(sentence => res.send({response: sentence}))
                                    .catch((err) => {
                                        res.send({response: "Aufgeschrieben hab ich es, aber hab leider keinen guten Satz für dich!"})
                                        console.log(err)
                                    });
                            })
                    })
            })
        })
});

app.get("/opa", (req, res) => {
    getSentence("opa").then(sentence => {
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










async function getSentence(type){
    return new Promise((resolve, reject) => {
        let model;
        switch (type){
            case "opa":
                model = opaModel;
                break;
            case "prost":
                model = drinkSentenceModel;
                break;
            default:
                reject(new Error("Diesen Satz-Typen gibts nicht!"));
        }

        model.countDocuments().exec(function (err, count) {
            let random = Math.floor(Math.random() * count)
            model.findOne()
                .skip(random)
                .then(result => {
                    resolve(result.sentence)
                }).catch(err => {
                reject(err);
            });
        });
    });
}