require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT
const config = JSON.parse(process.env.APP_CONFIG);

const {opaModel, drinkSentenceModel, personModelSS2021, drinksModelSS2021} = require('./api-models.js');

app.use(cors());

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://" + config.mongo.user + ":" + encodeURIComponent(config.mongo.password) + "@" + config.mongo.hostString, {useNewUrlParser: true, useUnifiedTopology:true})
    .then(() => console.log("I guess we're connected?"))
    .catch(err => console.log(err));

app.get("/",(req, res) => {
    res.send("Hi I'm Chicorée-Chantal!");
});

app.get("/drinks", (req, res) => {
    drinksModelSS2021.find({}, 'date -_id')
        .sort({'date': -1})
        .then(dates => {
            let resData = [];

            for (let i in dates){
                let date = new Date(dates[i].date.toLocaleString("de-De", {timeZone: process.env.TZ})).toLocaleString("de-De", {timeZone: process.env.TZ});
                resData.push({"date": date});
            }

            res.type('json');
            res.send(resData);
        });
});

app.get("/drinks/today", (req, res) => {
    let today = new Date();
    today.setHours(0,0,0,0);
    today = today.toLocaleString();
    drinksModelSS2021.findOne({date: today})
        .populate({path: 'data.person', select: 'username nickname -_id'})
        .then(data => {
        // console.log(data)
        res.type('json');
        if (data === null || data === undefined){
            res.send({});
        }else{
            let resData = {};
            let drinks = data.data;
            for (let i = 0; i < drinks.length; i++){
                let name = drinks[i].person.nickname|| drinks[i].person.username
                resData[name] = {
                    drinks: drinks[i].drinks,
                    alcoholAmount: drinks[i].alcoholAmount
                }
            }
            res.send(resData);
        }


    })
});

app.get("/drinks/d/:date", (req, res) => {
    let day = new Date(req.params.date);
    day.setHours(0,0,0,0);
    day = day.toLocaleString();

    drinksModelSS2021.findOne({date: day}, 'date data -_id')
        .populate({ path: 'data.person', select: 'username nickname -_id'})
        .then(data => {
            res.type('json');
            res.send(data.data);
        })
});

app.get("/drinks/ladder", (req, res) => {
    personModelSS2021.find({}, 'username nickname totalCount totalAmount totalAlcohol -_id')
        .sort({'totalAlcohol': -1})
        .limit(10)
        .then(data => {
            // console.log(data);
            res.send(data);
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
                let today = new Date();
                today.setHours(0,0,0,0);
                today = today.toLocaleString()
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
    console.log(`http://localhost:${port}/drinks/today`);
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